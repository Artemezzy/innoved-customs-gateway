<?php
/**
 * INNOVED LK — Backend API
 * Файл: public_html/api/index.php
 * PHP 8.x + MySQL | reg.ru виртуальный хостинг
 */
declare(strict_types=1);

error_reporting(0);

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . FRONTEND_ORIGIN);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path   = preg_replace('#^/?api/?#', '', trim($uri, '/'));
$seg    = explode('/', $path);

function db(): PDO {
    static $pdo = null;
    if (!$pdo) {
        $pdo = new PDO(
            'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    }
    return $pdo;
}

function out(mixed $d, int $c = 200): never { http_response_code($c); echo json_encode($d, JSON_UNESCAPED_UNICODE); exit; }
function err(string $m, int $c = 400): never { out(['error' => $m], $c); }
function body(): array { return (array) json_decode(file_get_contents('php://input'), true); }

/**
 * Отдать файл как бинарный download-ответ с корректными заголовками.
 * Сбрасывает буферы вывода и заменяет ранее выставленный Content-Type: application/json.
 */
function send_file_download(string $path, string $originalName): never {
    // Полностью очищаем всё, что могло попасть в буфер (пробелы, BOM, отладка)
    while (ob_get_level() > 0) { ob_end_clean(); }

    // Определяем MIME по содержимому файла, с фолбэком по расширению
    $mime = null;
    if (function_exists('finfo_open')) {
        $fi = finfo_open(FILEINFO_MIME_TYPE);
        if ($fi) { $mime = finfo_file($fi, $path) ?: null; finfo_close($fi); }
    }
    if (!$mime) {
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $map = [
            'pdf'  => 'application/pdf',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg', 'jpeg' => 'image/jpeg',
            'gif'  => 'image/gif',
            'webp' => 'image/webp',
            'svg'  => 'image/svg+xml',
            'zip'  => 'application/zip',
            'rar'  => 'application/vnd.rar',
            '7z'   => 'application/x-7z-compressed',
            'doc'  => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls'  => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt'  => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt'  => 'text/plain; charset=utf-8',
            'csv'  => 'text/csv; charset=utf-8',
            'json' => 'application/json; charset=utf-8',
            'xml'  => 'application/xml; charset=utf-8',
        ];
        $mime = $map[$ext] ?? 'application/octet-stream';
    }

    // ASCII-фолбэк имени файла для старых клиентов
    $asciiName = preg_replace('/[^A-Za-z0-9._-]+/', '_', $originalName);
    if ($asciiName === '' || $asciiName === null) { $asciiName = 'file'; }

    // Заменяем ранее выставленный Content-Type: application/json
    header('Content-Type: ' . $mime, true);
    header(
        'Content-Disposition: attachment; filename="' . $asciiName . '"; '
        . "filename*=UTF-8''" . rawurlencode($originalName),
        true
    );
    header('Content-Length: ' . filesize($path));
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: private, no-store');
    header('Pragma: no-cache');
    // Позволяем фронту прочитать имя файла из Content-Disposition
    header('Access-Control-Expose-Headers: Content-Disposition, Content-Length, Content-Type');

    readfile($path);
    exit;
}


function b64u(string $s): string { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }
function jwt_make(array $p): string {
    $h = b64u(json_encode(['alg'=>'HS256','typ'=>'JWT']));
    $b = b64u(json_encode($p));
    return "$h.$b.".b64u(hash_hmac('sha256', "$h.$b", JWT_SECRET, true));
}
function jwt_parse(string $t): ?array {
    $p = explode('.', $t); if (count($p) !== 3) return null;
    [$h,$b,$s] = $p;
    if (!hash_equals(b64u(hash_hmac('sha256', "$h.$b", JWT_SECRET, true)), $s)) return null;
    $d = json_decode(base64_decode(strtr($b, '-_', '+/')), true);
    return ($d && ($d['exp'] ?? 0) > time()) ? $d : null;
}
function auth(bool $mgr = false): array {
    preg_match('/Bearer\\s+(\\S+)/', $_SERVER['HTTP_AUTHORIZATION'] ?? '', $m);
    if (!isset($m[1])) err('Unauthorized', 401);
    $u = jwt_parse($m[1]); if (!$u) err('Token invalid or expired', 401);
    if ($mgr && $u['role'] !== 'manager') err('Forbidden', 403);
    return $u;
}
function gen_pass(int $n = 10): string {
    return substr(str_shuffle('abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#'), 0, $n);
}

function cert_request_guard(array $me, int $rid): array {
    $st = db()->prepare('SELECT * FROM lk_cert_requests WHERE id=?');
    $st->execute([$rid]);
    $r = $st->fetch();
    if (!$r) err('Заявка не найдена', 404);
    if ($me['role'] === 'cert_center' && (int)$r['cert_center_id'] !== (int)($me['cert_center_id'] ?? 0)) {
        err('Нет доступа', 403);
    }
    if (!in_array($me['role'], ['manager', 'cert_center'])) {
        err('Нет доступа', 403);
    }
    return $r;
}

// POST /api/auth/login
if ($method === 'POST' && $seg[0] === 'auth' && ($seg[1] ?? '') === 'login') {
    $b = body();
    $st = db()->prepare('SELECT * FROM lk_users WHERE email=? AND is_active=1 LIMIT 1');
    $st->execute([trim($b['email'] ?? '')]);
    $u = $st->fetch();
    if (!$u || !password_verify($b['password'] ?? '', $u['password_hash'])) err('Неверный email или пароль', 401);
    $token = jwt_make([
    'sub'            => $u['id'],
    'role'           => $u['role'],
    'client_id'      => $u['client_id'],
    'cert_center_id' => $u['cert_center_id'] ?? null,
    'name'           => $u['name'],
    'exp'            => time() + 86400 * 7,
        ]);
    out(['token' => $token, 'role' => $u['role'], 'name' => $u['name']]);
}

// GET /api/managers/stats
if ($method === 'GET' && $seg[0] === 'managers' && ($seg[1] ?? '') === 'stats') {
    auth(true);
    out([
        'clients_count'    => (int) db()->query('SELECT COUNT(*) FROM lk_clients WHERE is_active=1')->fetchColumn(),
        'shipments_active' => (int) db()->query("SELECT COUNT(*) FROM lk_shipments WHERE status NOT IN('released','on_hold')")->fetchColumn(),
        'messages_unread'  => (int) db()->query("SELECT COUNT(*) FROM lk_messages WHERE is_read=0 AND role='client'")->fetchColumn(),
    ]);
}

// GET /api/clients
if ($method === 'GET' && $seg[0] === 'clients' && !isset($seg[1])) {
    auth(true);
    $q = '%'.($_GET['q'] ?? '').'%';
    $activeFlag = (($_GET['status'] ?? '') === 'archived') ? 0 : 1;
    $st = db()->prepare(
        'SELECT c.*, COUNT(s.id) AS shipment_count
         FROM lk_clients c
         LEFT JOIN lk_shipments s ON s.client_id=c.id
         WHERE c.is_active=? AND (c.name LIKE ? OR c.inn LIKE ?)
         GROUP BY c.id
         ORDER BY c.name'
    );
    $st->execute([$activeFlag, $q, $q]);
    out($st->fetchAll());
}

// POST /api/clients
if ($method === 'POST' && $seg[0] === 'clients' && !isset($seg[1])) {
    auth(true);
    $b = body();
    foreach (['name','inn','email'] as $f) if (empty($b[$f])) err("Поле $f обязательно");
    $ex = db()->prepare('SELECT id FROM lk_users WHERE email=?'); $ex->execute([$b['email']]);
    if ($ex->fetch()) err('Email уже используется');

    $pass = gen_pass();
    $hash = password_hash($pass, PASSWORD_BCRYPT);
    db()->beginTransaction();
    try {
        $st = db()->prepare(
            'INSERT INTO lk_clients(name,inn,contact_person,phone,email,is_active,created_at)
             VALUES(?,?,?,?,?,1,NOW())'
        );
        $st->execute([
            $b['name'],
            $b['inn'],
            $b['contact_person'] ?? '',
            $b['phone'] ?? '',
            $b['email'],
        ]);
        $cid = db()->lastInsertId();

        $st2 = db()->prepare(
            'INSERT INTO lk_users(email,password_hash,name,role,client_id,is_active,created_at)
             VALUES(?,?,?,?,?,1,NOW())'
        );
        $st2->execute([
            $b['email'],
            $hash,
            $b['contact_person'] ?? $b['name'],
            'client',
            $cid,
        ]);

        db()->commit();
    } catch (\Throwable $e) {
        db()->rollBack();
        err('Ошибка БД: '.$e->getMessage());
    }

    out(['client_id' => (int) $cid, 'login' => $b['email'], 'password' => $pass], 201);
}

// POST /api/clients/:id/reset-password
if (
    $method === 'POST'
    && $seg[0] === 'clients'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'reset-password'
) {
    
    auth(true); // только менеджер

    $clientId = (int)$seg[1];

    // ищем пользователя-клиента по client_id
    $st = db()->prepare('SELECT id, email, name FROM lk_users WHERE client_id=? AND role="client" AND is_active=1 LIMIT 1');
    $st->execute([$clientId]);
    $u = $st->fetch();

    if (!$u) {
        err('Для этого клиента не найден пользователь с ролью client', 404);
    }

    $newPass = gen_pass();
    $hash = password_hash($newPass, PASSWORD_BCRYPT);

    $upd = db()->prepare('UPDATE lk_users SET password_hash=?, updated_at=NOW() WHERE id=?');
    $upd->execute([$hash, $u['id']]);

    out([
        'user_id'      => (int)$u['id'],
        'client_id'    => $clientId,
        'login'        => $u['email'],
        'name'         => $u['name'],
        'new_password' => $newPass,
    ]);
}

// DELETE /api/clients/:id  (soft-delete: деактивация клиента + его пользователя)
if ($method === 'DELETE' && $seg[0] === 'clients' && isset($seg[1]) && !isset($seg[2])) {
    auth(true); // только менеджер
    $clientId = (int)$seg[1];

    $st = db()->prepare('SELECT id FROM lk_clients WHERE id=? AND is_active=1');
    $st->execute([$clientId]);
    if (!$st->fetch()) err('Клиент не найден', 404);

    db()->prepare('UPDATE lk_clients SET is_active=0 WHERE id=?')->execute([$clientId]);
    db()->prepare('UPDATE lk_users SET is_active=0, updated_at=NOW() WHERE client_id=? AND role="client"')->execute([$clientId]);

    out(['ok' => true]);
}

// POST /api/clients/:id/restore  (восстановление из архива)
if ($method === 'POST' && $seg[0] === 'clients' && isset($seg[1]) && ($seg[2] ?? '') === 'restore') {
    auth(true);
    $clientId = (int)$seg[1];

    $st = db()->prepare('SELECT id FROM lk_clients WHERE id=? AND is_active=0');
    $st->execute([$clientId]);
    if (!$st->fetch()) err('Архивный клиент не найден', 404);

    db()->prepare('UPDATE lk_clients SET is_active=1 WHERE id=?')->execute([$clientId]);
    db()->prepare('UPDATE lk_users SET is_active=1, updated_at=NOW() WHERE client_id=? AND role="client"')->execute([$clientId]);

    out(['ok' => true]);
}

// GET /api/clients/:id
if ($method === 'GET' && $seg[0] === 'clients' && isset($seg[1]) && !isset($seg[2])) {
    auth(true);
    $st = db()->prepare(
        'SELECT c.*,
                (SELECT COUNT(*) FROM lk_shipments WHERE client_id=c.id) AS shipment_count
         FROM lk_clients c
         WHERE c.id=? AND c.is_active=1'
    );
    $st->execute([(int)$seg[1]]);
    $c = $st->fetch(); if (!$c) err('Клиент не найден', 404);
    out($c);
}

// GET /api/shipments
if ($method === 'GET' && $seg[0] === 'shipments' && !isset($seg[1])) {
    $me = auth();
    $sql = 'SELECT s.*, c.name AS client_name
            FROM lk_shipments s
            JOIN lk_clients c ON c.id=s.client_id
            WHERE 1=1';
    $p = [];
    if ($me['role'] === 'client') { $sql .= ' AND s.client_id=?'; $p[] = $me['client_id']; }
    if (!empty($_GET['status'])) { $sql .= ' AND s.status=?'; $p[] = $_GET['status']; }
    if (!empty($_GET['client_id']) && $me['role'] === 'manager') { $sql .= ' AND s.client_id=?'; $p[] = (int)$_GET['client_id']; }
    $sql .= ' ORDER BY s.updated_at DESC';
    $st = db()->prepare($sql); $st->execute($p);
    out($st->fetchAll());
}

// POST /api/shipments
if ($method === 'POST' && $seg[0] === 'shipments' && !isset($seg[1])) {
    $me = auth();           // авторизуем любого пользователя (менеджер или клиент)
    $b  = body();

    // Определяем client_id в зависимости от роли
    if ($me['role'] === 'manager') {
        // менеджер должен явно указать клиента
        if (empty($b['client_id'])) {
            err('client_id обязателен для менеджера');
        }
        $clientId = (int)$b['client_id'];
    } elseif ($me['role'] === 'client') {
        // клиент создаёт поставку только для себя
        if (empty($me['client_id'])) {
            err('У пользователя-клиента не задан client_id', 400);
        }
        $clientId = (int)$me['client_id'];
    } else {
        // на всякий случай блокируем любые другие роли
        err('Недопустимая роль для создания поставки', 403);
    }

    $title = $b['title'] ?? 'Поставка';

    $st = db()->prepare(
        "INSERT INTO lk_shipments(client_id,title,status,created_at,updated_at)
         VALUES(?,?,'new',NOW(),NOW())"
    );
    $st->execute([$clientId, $title]);

    out(['id' => (int)db()->lastInsertId()], 201);
}

// GET /api/shipments/:id
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && !isset($seg[2])) {
    $me = auth();
    $id = (int)$seg[1];
    $st = db()->prepare(
        'SELECT s.*, c.name AS client_name
         FROM lk_shipments s
         JOIN lk_clients c ON c.id=s.client_id
         WHERE s.id=?'
    );
    $st->execute([$id]); $s = $st->fetch(); if (!$s) err('Не найдено', 404);
    if ($me['role'] === 'client' && $s['client_id'] != $me['client_id']) err('Нет доступа', 403);
    out($s);
}

// PUT /api/shipments/:id
if ($method === 'PUT' && $seg[0] === 'shipments' && isset($seg[1]) && !isset($seg[2])) {
    auth(true);
    $b = body();
    $valid = ['new','documents_requested','documents_received','declaration_filed','customs_inspection','released','on_hold'];
    if (!in_array($b['status'] ?? '', $valid)) err('Недопустимый статус');
    db()->prepare('UPDATE lk_shipments SET status=?, updated_at=NOW() WHERE id=?')
       ->execute([$b['status'], (int)$seg[1]]);
    out(['ok' => true]);
}

// DELETE /api/shipments/:id
if ($method === 'DELETE' && $seg[0] === 'shipments' && isset($seg[1]) && !isset($seg[2])) {
    // Только менеджер может удалять поставки
    auth(true);

    $id = (int)$seg[1];

    // Проверяем, что такая поставка существует
    $st = db()->prepare('SELECT id FROM lk_shipments WHERE id=?');
    $st->execute([$id]);
    $shipment = $st->fetch();
    if (!$shipment) {
        err('Поставка не найдена', 404);
    }

    // Удаляем запись из lk_shipments
    db()->prepare('DELETE FROM lk_shipments WHERE id=?')->execute([$id]);

    out(['ok' => true]);
}

// GET /api/shipments/:id/documents
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'documents' && !isset($seg[3])) {
    $me  = auth();
    $sid = (int)$seg[1];
    if ($me['role'] === 'client') {
        $c = db()->prepare('SELECT client_id FROM lk_shipments WHERE id=?'); $c->execute([$sid]);
        $s = $c->fetch(); if (!$s || $s['client_id'] != $me['client_id']) err('Нет доступа', 403);
    }
    $sql = 'SELECT * FROM lk_documents WHERE shipment_id=?';
    if ($me['role'] === 'client') $sql .= ' AND visible_to_client=1';
    $sql .= ' ORDER BY created_at DESC';
    $st = db()->prepare($sql); $st->execute([$sid]);
    out($st->fetchAll());
}

// POST /api/shipments/:id/documents
if ($method === 'POST' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'documents' && !isset($seg[3])) {
    $me  = auth();
    $sid = (int)$seg[1];
    if ($me['role'] === 'client') {
        $c = db()->prepare('SELECT client_id FROM lk_shipments WHERE id=?'); $c->execute([$sid]);
        $s = $c->fetch(); if (!$s || $s['client_id'] != $me['client_id']) err('Нет доступа', 403);
    }
    if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) err('Файл не загружен');
    $file = $_FILES['file'];
    if ($file['size'] > MAX_FILE_SIZE) err('Файл слишком большой (макс. 20 МБ)');
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['pdf','doc','docx','xls','xlsx','jpg','jpeg','png'])) err('Недопустимый тип файла');

    $dir = UPLOAD_PATH.'/'.$sid;
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $stored = uniqid('doc_').'.'.$ext;
    if (!move_uploaded_file($file['tmp_name'], $dir.'/'.$stored)) err('Ошибка сохранения файла');

    $vis  = $me['role'] === 'manager' ? (int)($_POST['visible_to_client'] ?? 0) : 1;
    $edit = $me['role'] === 'manager' ? (int)($_POST['editable_by_client'] ?? 0) : 0;

    $st = db()->prepare(
        'INSERT INTO lk_documents(
           shipment_id, filename_original, filename_stored, doc_type,
           uploader_id, uploader_role, visible_to_client, editable_by_client, created_at
         ) VALUES(?,?,?,?,?,?,?,?,NOW())'
    );
    $st->execute([
        $sid,
        $file['name'],
        $stored,
        $_POST['doc_type'] ?? 'other',
        $me['sub'],
        $me['role'],
        $vis,
        $edit,
    ]);
    out(['id' => (int)db()->lastInsertId()], 201);
}

// GET /api/shipments/:id/documents/:docId/download
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'documents' && isset($seg[3]) && ($seg[4] ?? '') === 'download') {
    $me  = auth();
    $sid = (int)$seg[1];
    $did = (int)$seg[3];
    $st  = db()->prepare('SELECT * FROM lk_documents WHERE id=? AND shipment_id=?');
    $st->execute([$did, $sid]); $doc = $st->fetch(); if (!$doc) err('Не найдено', 404);
    if ($me['role'] === 'client' && !$doc['visible_to_client']) err('Нет доступа', 403);

    $path = UPLOAD_PATH.'/'.$sid.'/'.$doc['filename_stored'];
    if (!file_exists($path)) err('Файл не найден', 404);

    send_file_download($path, $doc['filename_original']);

}

// DELETE /api/shipments/:id/documents/:docId
if ($method === 'DELETE' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'documents' && isset($seg[3])) {
    auth(true);
    $sid = (int)$seg[1];
    $did = (int)$seg[3];
    $st  = db()->prepare('SELECT * FROM lk_documents WHERE id=? AND shipment_id=?');
    $st->execute([$did, $sid]); $doc = $st->fetch(); if (!$doc) err('Не найдено', 404);

    $path = UPLOAD_PATH.'/'.$sid.'/'.$doc['filename_stored'];
    if (file_exists($path)) unlink($path);
    db()->prepare('DELETE FROM lk_documents WHERE id=?')->execute([$did]);
    out(['ok' => true]);
}

// GET /api/shipments/:id/messages
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'messages') {
    $me  = auth();
    $sid = (int)$seg[1];
    if ($me['role'] === 'client') {
        $c = db()->prepare('SELECT client_id FROM lk_shipments WHERE id=?'); $c->execute([$sid]);
        $s = $c->fetch(); if (!$s || $s['client_id'] != $me['client_id']) err('Нет доступа', 403);
    }
    $since = $_GET['since'] ?? '1970-01-01 00:00:00';
    $st = db()->prepare(
        'SELECT m.*, u.name AS sender_name
         FROM lk_messages m
         JOIN lk_users u ON u.id=m.user_id
         WHERE m.shipment_id=? AND m.created_at>?
         ORDER BY m.created_at ASC'
    );
    $st->execute([$sid, $since]);

    $other = $me['role'] === 'manager' ? 'client' : 'manager';
    db()->prepare("UPDATE lk_messages SET is_read=1 WHERE shipment_id=? AND role=? AND is_read=0")
       ->execute([$sid, $other]);

    out($st->fetchAll());
}

// POST /api/shipments/:id/messages
if ($method === 'POST' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'messages') {
    $me  = auth();
    $sid = (int)$seg[1];
    if ($me['role'] === 'client') {
        $c = db()->prepare('SELECT client_id FROM lk_shipments WHERE id=?'); $c->execute([$sid]);
        $s = $c->fetch(); if (!$s || $s['client_id'] != $me['client_id']) err('Нет доступа', 403);
    }
    $text = trim(body()['text'] ?? '');
    if (!$text) err('Пустое сообщение');
    $st = db()->prepare(
        'INSERT INTO lk_messages(shipment_id,user_id,role,text,is_read,created_at)
         VALUES(?,?,?,?,0,NOW())'
    );
    $st->execute([$sid, $me['sub'], $me['role'], $text]);
    out(['id' => (int)db()->lastInsertId()], 201);
}

// GET /api/managers/messages
if ($method === 'GET' && $seg[0] === 'managers' && ($seg[1] ?? '') === 'messages') {
    auth(true);
    $st = db()->query("
        SELECT s.id AS shipment_id,
               s.title,
               c.name AS client_name,
               m.text AS last_message,
               m.created_at AS last_message_at,
               (SELECT COUNT(*) FROM lk_messages
                 WHERE shipment_id=s.id AND is_read=0 AND role='client') AS unread_count
        FROM lk_shipments s
        JOIN lk_clients c ON c.id=s.client_id
        JOIN lk_messages m ON m.id=(SELECT MAX(id) FROM lk_messages WHERE shipment_id=s.id)
        ORDER BY m.created_at DESC
        LIMIT 50
    ");
    out($st->fetchAll());
}

// ================= СЕРТИФИКАЦИОННЫЕ ЦЕНТРЫ =================

// GET /api/cert-centers  (только менеджер)
if ($method === 'GET' && $seg[0] === 'cert-centers' && !isset($seg[1])) {
    auth(true);
    $q = '%'.($_GET['q'] ?? '').'%';
    $activeFlag = (($_GET['status'] ?? '') === 'archived') ? 0 : 1;
    $st = db()->prepare(
        'SELECT cc.*, COUNT(r.id) AS requests_count
         FROM lk_cert_centers cc
         LEFT JOIN lk_cert_requests r ON r.cert_center_id=cc.id
         WHERE cc.is_active=? AND cc.name LIKE ?
         GROUP BY cc.id ORDER BY cc.name'
    );
    $st->execute([$activeFlag, $q]);
    out($st->fetchAll());
}

// POST /api/cert-centers  (менеджер создаёт сертификационный центр)
if ($method === 'POST' && $seg[0] === 'cert-centers' && !isset($seg[1])) {
    auth(true);
    $b = body();
    foreach (['name','email'] as $f) if (empty($b[$f])) err("Поле $f обязательно");
    $ex = db()->prepare('SELECT id FROM lk_users WHERE email=?'); $ex->execute([$b['email']]);
    if ($ex->fetch()) err('Email уже используется');

    $pass = gen_pass();
    $hash = password_hash($pass, PASSWORD_BCRYPT);
    db()->beginTransaction();
    try {
        $st = db()->prepare(
            'INSERT INTO lk_cert_centers(name,contact_person,phone,email,is_active,created_at)
             VALUES(?,?,?,?,1,NOW())'
        );
        $st->execute([$b['name'], $b['contact_person'] ?? '', $b['phone'] ?? '', $b['email']]);
        $ccid = db()->lastInsertId();

        $st2 = db()->prepare(
            'INSERT INTO lk_users(email,password_hash,name,role,cert_center_id,is_active,created_at)
             VALUES(?,?,?,\'cert_center\',?,1,NOW())'
        );
        $st2->execute([$b['email'], $hash, $b['contact_person'] ?? $b['name'], $ccid]);

        db()->commit();
    } catch (\Throwable $e) {
        db()->rollBack();
        err('Ошибка БД: '.$e->getMessage());
    }
    out(['cert_center_id' => (int)$ccid, 'login' => $b['email'], 'password' => $pass], 201);
}

// POST /api/cert-centers/:id/reset-password
if ($method === 'POST' && $seg[0] === 'cert-centers' && isset($seg[1]) && ($seg[2] ?? '') === 'reset-password') {
    auth(true);
    $ccId = (int)$seg[1];
    $st = db()->prepare('SELECT id, email, name FROM lk_users WHERE cert_center_id=? AND role=\'cert_center\' AND is_active=1 LIMIT 1');
    $st->execute([$ccId]);
    $u = $st->fetch();
    if (!$u) err('Пользователь не найден', 404);
    $newPass = gen_pass();
    db()->prepare('UPDATE lk_users SET password_hash=?, updated_at=NOW() WHERE id=?')
       ->execute([password_hash($newPass, PASSWORD_BCRYPT), $u['id']]);
    out(['login' => $u['email'], 'new_password' => $newPass]);
}

// DELETE /api/cert-centers/:id  (soft-delete)
if ($method === 'DELETE' && $seg[0] === 'cert-centers' && isset($seg[1]) && !isset($seg[2])) {
    auth(true);
    $ccId = (int)$seg[1];

    $st = db()->prepare('SELECT id FROM lk_cert_centers WHERE id=? AND is_active=1');
    $st->execute([$ccId]);
    if (!$st->fetch()) err('Сертификационный центр не найден', 404);

    db()->prepare('UPDATE lk_cert_centers SET is_active=0, updated_at=NOW() WHERE id=?')->execute([$ccId]);
    db()->prepare('UPDATE lk_users SET is_active=0, updated_at=NOW() WHERE cert_center_id=? AND role="cert_center"')->execute([$ccId]);

    out(['ok' => true]);
}

// POST /api/cert-centers/:id/restore
if ($method === 'POST' && $seg[0] === 'cert-centers' && isset($seg[1]) && ($seg[2] ?? '') === 'restore') {
    auth(true);
    $ccId = (int)$seg[1];

    $st = db()->prepare('SELECT id FROM lk_cert_centers WHERE id=? AND is_active=0');
    $st->execute([$ccId]);
    if (!$st->fetch()) err('Архивный центр не найден', 404);

    db()->prepare('UPDATE lk_cert_centers SET is_active=1, updated_at=NOW() WHERE id=?')->execute([$ccId]);
    db()->prepare('UPDATE lk_users SET is_active=1, updated_at=NOW() WHERE cert_center_id=? AND role="cert_center"')->execute([$ccId]);

    out(['ok' => true]);
}

// ================= ЗАЯВКИ НА СЕРТИФИКАЦИЮ =================

// GET /api/cert-requests  (менеджер видит все, центр — только свои)
if ($method === 'GET' && $seg[0] === 'cert-requests' && !isset($seg[1])) {
    $me = auth();
    $sql = "SELECT r.*,
                   cc.name AS cert_center_name,
                   (
                     SELECT i.company
                     FROM lk_cert_request_items i
                     WHERE i.request_id = r.id
                     ORDER BY i.position_no ASC, i.id ASC
                     LIMIT 1
                   ) AS company
            FROM lk_cert_requests r
            JOIN lk_cert_centers cc ON cc.id = r.cert_center_id
            WHERE 1=1";
    $p = [];

    if ($me['role'] === 'cert_center') {
        $sql .= ' AND r.cert_center_id=?';
        $p[] = $me['cert_center_id'];
    } elseif ($me['role'] !== 'manager') {
        err('Недопустимая роль', 403);
    }

    if (!empty($_GET['status'])) {
        $sql .= ' AND r.status=?';
        $p[] = $_GET['status'];
    }

    $sql .= ' ORDER BY r.created_at DESC';

    $st = db()->prepare($sql);
    $st->execute($p);
    $rows = $st->fetchAll();

    foreach ($rows as &$row) {
        $row['has_unread'] = $me['role'] === 'manager'
            ? (strtotime($row['updated_at']) > strtotime($row['manager_seen_at'] ?? '1970-01-01'))
            : (strtotime($row['updated_at']) > strtotime($row['center_seen_at'] ?? '1970-01-01'));
    }

    out($rows);
}

// POST /api/cert-requests  (только менеджер, привязывает к центру)
if ($method === 'POST' && $seg[0] === 'cert-requests' && !isset($seg[1])) {
    $me = auth(true);
    $b = body();

    if (empty($b['cert_center_id'])) err('cert_center_id обязателен');

    $certCenterId = (int)$b['cert_center_id'];
    $company = trim((string)($b['company'] ?? ''));

    $cc = db()->prepare('SELECT id FROM lk_cert_centers WHERE id=? AND is_active=1 LIMIT 1');
    $cc->execute([$certCenterId]);
    if (!$cc->fetch()) err('Сертификационный центр не найден', 404);

    db()->beginTransaction();
    try {
        $st = db()->prepare(
            "INSERT INTO lk_cert_requests(
                cert_center_id,
                status,
                created_by,
                created_at,
                updated_at,
                updated_by_role,
                manager_seen_at,
                center_seen_at
            ) VALUES (?, 'open', ?, NOW(), NOW(), 'manager', NOW(), NULL)"
        );
        $st->execute([$certCenterId, (int)$me['sub']]);
        $rid = (int)db()->lastInsertId();

        $stItem = db()->prepare(
            "INSERT INTO lk_cert_request_items(
                request_id,
                position_no,
                company,
                product,
                tn_ved,
                tech_description,
                tr_ts,
                cert_form,
                cert_scheme,
                cost,
                comment,
                created_at,
                updated_at
            ) VALUES (?, 1, ?, '', '', '', '', '', '', '', '', NOW(), NOW())"
        );
        $stItem->execute([$rid, $company]);

        db()->commit();
    } catch (\Throwable $e) {
        db()->rollBack();
        err('Ошибка БД: '.$e->getMessage());
    }

    out(['id' => $rid], 201);
}

// GET /api/cert-requests/:id  (детали заявки + позиции товаров)
if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && !isset($seg[2])) {
    $me = auth();
    $rid = (int)$seg[1];
    $r = cert_request_guard($me, $rid);

    $seenCol = $me['role'] === 'manager' ? 'manager_seen_at' : 'center_seen_at';
    db()->prepare("UPDATE lk_cert_requests SET $seenCol=NOW() WHERE id=?")->execute([$rid]);

    $sti = db()->prepare('SELECT * FROM lk_cert_request_items WHERE request_id=? ORDER BY position_no ASC, id ASC');
    $sti->execute([$rid]);
    $items = $sti->fetchAll();

    $stf = db()->prepare('SELECT * FROM lk_cert_request_files WHERE request_id=? ORDER BY created_at DESC');
    $stf->execute([$rid]);
    $files = $stf->fetchAll();

    out([
        'request' => $r,
        'items' => $items,
        'files'   => $files, 
    ]);
}

// PUT /api/cert-requests/:id  (смена статуса — менеджер и центр)
if ($method === 'PUT' && $seg[0] === 'cert-requests' && isset($seg[1]) && !isset($seg[2])) {
    $me = auth();
    $rid = (int)$seg[1];
    cert_request_guard($me, $rid);
    $b = body();
    if (!in_array($b['status'] ?? '', ['open','in_progress','closed'])) err('Недопустимый статус');
    $seenCol = $me['role'] === 'manager' ? 'manager_seen_at' : 'center_seen_at';
    db()->prepare("UPDATE lk_cert_requests SET status=?, updated_at=NOW(), updated_by_role=?, $seenCol=NOW() WHERE id=?")
       ->execute([$b['status'], $me['role'], $rid]);
    out(['ok' => true]);
}

// GET /api/cert-requests/:id/items — список товарных позиций заявки
if (
    $method === 'GET'
    && $seg[0] === 'cert-requests'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'items'
    && !isset($seg[3]) 
) {
    $me = auth();
    $rid = (int)$seg[1];
    cert_request_guard($me, $rid);
    $st = db()->prepare('SELECT * FROM lk_cert_request_items WHERE request_id=? ORDER BY position_no ASC, id ASC');
    $st->execute([$rid]);
    out($st->fetchAll());
}

// GET /api/cert-requests/:id/export  — выгрузка заявки в Excel-совместимый CSV
if (
    $method === 'GET'
    && $seg[0] === 'cert-requests'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'export'
) {
    $me  = auth();
    $rid = (int)$seg[1];

    // Проверяем доступ к заявке (менеджер или привязанный сертификационный центр)
    $request = cert_request_guard($me, $rid);

    // Готовим выборку по позициям товара
    $sti = db()->prepare(
        'SELECT i.position_no,
                i.company,
                i.product,
                i.tn_ved,
                i.tech_description,
                i.tr_ts,
                i.cert_form,
                i.cert_scheme,
                i.cost,
                i.comment,
                cc.name AS cert_center_name
         FROM lk_cert_request_items i
         JOIN lk_cert_requests r ON r.id = i.request_id
         JOIN lk_cert_centers cc ON cc.id = r.cert_center_id
         WHERE i.request_id = ?
         ORDER BY i.position_no ASC, i.id ASC'
    );
    $sti->execute([$rid]);
    $items = $sti->fetchAll();

    // Заголовки для файла
    $filename = 'cert-request-' . $rid . '.csv';

    // Заголовки HTTP для скачивания (Excel дружит с CSV + BOM)[web:227][web:228]
    header('Pragma: public');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Cache-Control: private', false);
    header('Content-Description: File Transfer');
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="'.$filename.'"');
    header('Content-Transfer-Encoding: binary');

    $out = fopen('php://output', 'w');

    // UTF-8 BOM, чтобы Excel корректно прочитал русские буквы[web:228]
    fwrite($out, chr(0xEF) . chr(0xBB) . chr(0xBF));

    // Первая строка — шапка таблицы (названия столбцов)
    // Можно менять формулировки, но структура должна соответствовать текущим полям
    fputcsv(
        $out,
        [
            '№ позиции',          // position_no
            'Компания',           // company
            'Товар',              // product
            'ТН ВЭД',             // tn_ved
            'Техническое описание', // tech_description
            'ТР ТС',              // tr_ts
            'Форма сертификации', // cert_form
            'Схема сертификации', // cert_scheme
            'Стоимость',          // cost
            'Комментарий',        // comment
            'Сертификационный центр', // cert_center_name (одинаковый для всех строк)
            '№ заявки',           // request.id
            'Дата создания',      // request.created_at
            'Статус',             // request.status
        ],
        ';' // разделитель — точка с запятой, Excel его хорошо понимает[web:220]
    );

    // Строки с данными по каждой товарной позиции
    foreach ($items as $row) {
        fputcsv(
            $out,
            [
                (int)$row['position_no'],
                (string)$row['company'],
                (string)$row['product'],
                (string)$row['tn_ved'],
                (string)$row['tech_description'],
                (string)$row['tr_ts'],
                (string)$row['cert_form'],
                (string)$row['cert_scheme'],
                (string)$row['cost'],
                (string)$row['comment'],
                (string)$row['cert_center_name'],
                (int)$request['id'],
                (string)$request['created_at'],
                (string)$request['status'],
            ],
            ';'
        );
    }

    fclose($out);
    exit;
}

// POST /api/cert-requests/:id/items — добавить новую позицию товара (менеджер и центр)
if ($method === 'POST' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && !isset($seg[3])) {
    $me = auth();
    $rid = (int)$seg[1];
    cert_request_guard($me, $rid);
    $b = body();

    $st = db()->prepare('SELECT COALESCE(MAX(position_no),0)+1 FROM lk_cert_request_items WHERE request_id=?');
    $st->execute([$rid]);
    $nextPos = (int)$st->fetchColumn();

    $allowed = ['company','product','tn_ved','tech_description','tr_ts','cert_form','cert_scheme','cost','comment'];
    $cols = ['request_id','position_no'];
    $vals = [$rid, $nextPos];
    $marks = ['?','?'];

    foreach ($allowed as $f) {
        $cols[] = $f;
        $vals[] = $b[$f] ?? '';
        $marks[] = '?';
    }

    $sql = 'INSERT INTO lk_cert_request_items('.implode(',', $cols).',created_at,updated_at) VALUES('.implode(',', $marks).',NOW(),NOW())';
    db()->prepare($sql)->execute($vals);
    $itemId = (int)db()->lastInsertId();

    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);

    out(['id' => $itemId, 'position_no' => $nextPos], 201);
}

// PUT /api/cert-requests/:id/items/:itemId — редактировать одну позицию (обе стороны)
if ($method === 'PUT' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3])) {
    $me = auth();
    $rid = (int)$seg[1];
    $iid = (int)$seg[3];
    cert_request_guard($me, $rid);

    $chk = db()->prepare('SELECT id FROM lk_cert_request_items WHERE id=? AND request_id=?');
    $chk->execute([$iid, $rid]);
    if (!$chk->fetch()) err('Позиция не найдена', 404);

    $b = body();
    $allowed = ['company','product','tn_ved','tech_description','tr_ts','cert_form','cert_scheme','cost','comment'];
    $set = []; $vals = [];
    foreach ($allowed as $f) if (array_key_exists($f, $b)) { $set[] = "$f=?"; $vals[] = $b[$f]; }
    if (!$set) err('Нет данных для обновления');
    $vals[] = $iid;
    db()->prepare('UPDATE lk_cert_request_items SET '.implode(',', $set).', updated_at=NOW() WHERE id=?')->execute($vals);

    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    out(['ok' => true]);
}

// DELETE /api/cert-requests/:id/items/:itemId — удалить позицию (обе стороны, минимум 1 позиция должна остаться)
if ($method === 'DELETE' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3])) {
    $me = auth();
    $rid = (int)$seg[1];
    $iid = (int)$seg[3];
    cert_request_guard($me, $rid);

    $cnt = (int) db()->query("SELECT COUNT(*) FROM lk_cert_request_items WHERE request_id=$rid")->fetchColumn();
    if ($cnt <= 1) err('В заявке должна остаться хотя бы одна позиция товара');

    db()->prepare('DELETE FROM lk_cert_request_items WHERE id=? AND request_id=?')->execute([$iid, $rid]);
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    out(['ok' => true]);
}

// DELETE /api/cert-requests/:id  (только менеджер)
if ($method === 'DELETE' && $seg[0] === 'cert-requests' && isset($seg[1]) && !isset($seg[2])) {
    auth(true);
    $rid = (int)$seg[1];
    $st = db()->prepare('SELECT id FROM lk_cert_requests WHERE id=?'); $st->execute([$rid]);
    if (!$st->fetch()) err('Заявка не найдена', 404);
    db()->prepare('DELETE FROM lk_cert_requests WHERE id=?')->execute([$rid]);
    out(['ok' => true]);
}

// POST /api/cert-requests/:id/items/:itemId/files  (файл или ссылка к позиции товара)
if (
    $method === 'POST'
    && $seg[0] === 'cert-requests'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'items'
    && isset($seg[3])
    && ($seg[4] ?? '') === 'files'
) {
    $me  = auth();
    $rid = (int)$seg[1];
    $iid = (int)$seg[3];

    // проверяем, что заявка существует и доступна
    cert_request_guard($me, $rid);

    // проверяем, что позиция товара существует и принадлежит этой заявке
    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?');
    $stItem->execute([$iid]);
    $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) {
        err('Позиция товара не найдена или не принадлежит заявке', 404);
    }

    // ССЫЛКА
    if (!empty($_POST['url'])) {
        db()->prepare(
            'INSERT INTO lk_cert_request_files(
                request_id,
                item_id,
                file_type,
                url,
                uploader_id,
                uploader_role,
                created_at
            ) VALUES(?,?,?,?,?,?,NOW())'
        )->execute([$rid, $iid, 'link', $_POST['url'], $me['sub'], $me['role']]);

        db()->prepare(
            'UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?'
        )->execute([$me['role'], $rid]);

        out(['ok' => true], 201);
    }

    // ФАЙЛ
    if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        err('Файл не загружен');
    }
    $file = $_FILES['file'];
    if ($file['size'] > MAX_FILE_SIZE) err('Файл слишком большой (макс. 20 МБ)');
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['pdf','doc','docx','xls','xlsx','jpg','jpeg','png'])) {
        err('Недопустимый тип файла');
    }

    $dir = UPLOAD_PATH.'/cert/'.$rid;
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $stored = uniqid('cf_').'.'.$ext;
    if (!move_uploaded_file($file['tmp_name'], $dir.'/'.$stored)) {
        err('Ошибка сохранения файла');
    }

    db()->prepare(
        'INSERT INTO lk_cert_request_files(
            request_id,
            item_id,
            file_type,
            filename_original,
            filename_stored,
            uploader_id,
            uploader_role,
            created_at
        ) VALUES(?,?,?,?,?,?,?,NOW())'
    )->execute([$rid, $iid, 'file', $file['name'], $stored, $me['sub'], $me['role']]);

    db()->prepare(
        'UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?'
    )->execute([$me['role'], $rid]);

    out(['id' => (int)db()->lastInsertId()], 201);
}

// GET /api/cert-requests/:id/items/:itemId/files/:fileId/download
if (
    $method === 'GET'
    && $seg[0] === 'cert-requests'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'items'
    && isset($seg[3])
    && ($seg[4] ?? '') === 'files'
    && isset($seg[5])
    && ($seg[6] ?? '') === 'download'
) {
    $me  = auth();
    $rid = (int)$seg[1];
    $iid = (int)$seg[3];
    $fid = (int)$seg[5];

    cert_request_guard($me, $rid);

    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?');
    $stItem->execute([$iid]);
    $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) {
        err('Позиция товара не найдена или не принадлежит заявке', 404);
    }

    $st = db()->prepare(
        'SELECT * FROM lk_cert_request_files WHERE id=? AND request_id=? AND item_id=?'
    );
    $st->execute([$fid, $rid, $iid]);
    $f = $st->fetch();
    if (!$f || $f['file_type'] !== 'file') err('Не найдено', 404);

    $path = UPLOAD_PATH.'/cert/'.$rid.'/'.$f['filename_stored'];
    if (!file_exists($path)) err('Файл не найден', 404);

    send_file_download($path, $f['filename_original']);

}

// DELETE /api/cert-requests/:id/items/:itemId/files/:fileId — удалить вложение
if (
    $method === 'DELETE'
    && $seg[0] === 'cert-requests'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'items'
    && isset($seg[3])
    && ($seg[4] ?? '') === 'files'
    && isset($seg[5])
    && !isset($seg[6])
) {
    $me  = auth();
    $rid = (int)$seg[1];
    $iid = (int)$seg[3];
    $fid = (int)$seg[5];

    // Проверяем доступ к заявке
    cert_request_guard($me, $rid);

    // Проверяем, что позиция товара существует и принадлежит этой заявке
    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?');
    $stItem->execute([$iid]);
    $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) {
        err('Позиция товара не найдена или не принадлежит заявке', 404);
    }

    // Ищем файл/ссылку
    $stFile = db()->prepare(
        'SELECT * FROM lk_cert_request_files WHERE id=? AND request_id=? AND item_id=?'
    );
    $stFile->execute([$fid, $rid, $iid]);
    $file = $stFile->fetch();
    if (!$file) {
        err('Вложение не найдено', 404);
    }

    // Если это настоящий файл — удаляем с диска
    if ($file['file_type'] === 'file' && !empty($file['filename_stored'])) {
        $path = UPLOAD_PATH.'/cert/'.$rid.'/'.$file['filename_stored'];
        if (file_exists($path)) {
            @unlink($path);
        }
    }

    // Удаляем запись из БД
    db()->prepare(
        'DELETE FROM lk_cert_request_files WHERE id=? AND request_id=? AND item_id=?'
    )->execute([$fid, $rid, $iid]);

    // Обновляем метаданные заявки (чтобы has_unread корректно считался)
    db()->prepare(
        'UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?'
    )->execute([$me['role'], $rid]);

    out(['ok' => true]);
}

// GET /api/cert-requests/:id/items/:itemId/files
if (
    $method === 'GET'
    && $seg[0] === 'cert-requests'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'items'
    && isset($seg[3])
    && ($seg[4] ?? '') === 'files'
    && !isset($seg[5])
) {
    $me  = auth();
    $rid = (int)$seg[1];
    $iid = (int)$seg[3];

    cert_request_guard($me, $rid);

    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?');
    $stItem->execute([$iid]);
    $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) {
        err('Позиция товара не найдена или не принадлежит заявке', 404);
    }

    $st = db()->prepare(
        'SELECT * FROM lk_cert_request_files WHERE request_id=? AND item_id=? ORDER BY created_at DESC'
    );
    $st->execute([$rid, $iid]);
    out($st->fetchAll());
}

// ================= ЧАТ ЗАЯВКИ =================

// GET /api/cert-requests/:id/messages
if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'messages') {
    $me = auth();
    $rid = (int)$seg[1];
    cert_request_guard($me, $rid);
    $since = $_GET['since'] ?? '1970-01-01 00:00:00';
    $st = db()->prepare(
        'SELECT m.*, u.name AS sender_name
         FROM lk_cert_messages m JOIN lk_users u ON u.id=m.user_id
         WHERE m.request_id=? AND m.created_at>? ORDER BY m.created_at ASC'
    );
    $st->execute([$rid, $since]);
    $other = $me['role'] === 'manager' ? 'cert_center' : 'manager';
    db()->prepare('UPDATE lk_cert_messages SET is_read=1 WHERE request_id=? AND role=? AND is_read=0')
       ->execute([$rid, $other]);
    out($st->fetchAll());
}

// POST /api/cert-requests/:id/messages
if ($method === 'POST' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'messages') {
    $me = auth();
    $rid = (int)$seg[1];
    cert_request_guard($me, $rid);
    $text = trim(body()['text'] ?? '');
    if (!$text) err('Пустое сообщение');
    db()->prepare('INSERT INTO lk_cert_messages(request_id,user_id,role,text,is_read,created_at) VALUES(?,?,?,?,0,NOW())')
       ->execute([$rid, $me['sub'], $me['role'], $text]);
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    out(['id' => (int)db()->lastInsertId()], 201);
}

// GET /api/managers/cert-stats  (для дашборда менеджера, опционально)
if ($method === 'GET' && $seg[0] === 'managers' && ($seg[1] ?? '') === 'cert-stats') {
    auth(true);
    out([
        'cert_centers_count' => (int) db()->query('SELECT COUNT(*) FROM lk_cert_centers WHERE is_active=1')->fetchColumn(),
        'cert_requests_open' => (int) db()->query("SELECT COUNT(*) FROM lk_cert_requests WHERE status!='closed'")->fetchColumn(),
    ]);
}

err('Маршрут не найден', 404);