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

// POST /api/auth/login
if ($method === 'POST' && $seg[0] === 'auth' && ($seg[1] ?? '') === 'login') {
    $b = body();
    $st = db()->prepare('SELECT * FROM lk_users WHERE email=? AND is_active=1 LIMIT 1');
    $st->execute([trim($b['email'] ?? '')]);
    $u = $st->fetch();
    if (!$u || !password_verify($b['password'] ?? '', $u['password_hash'])) err('Неверный email или пароль', 401);
    $token = jwt_make([
        'sub'       => $u['id'],
        'role'      => $u['role'],
        'client_id' => $u['client_id'],
        'name'      => $u['name'],
        'exp'       => time() + 86400 * 7,
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
    $st = db()->prepare(
        'SELECT c.*, COUNT(s.id) AS shipment_count
         FROM lk_clients c
         LEFT JOIN lk_shipments s ON s.client_id=c.id
         WHERE c.is_active=1 AND (c.name LIKE ? OR c.inn LIKE ?)
         GROUP BY c.id
         ORDER BY c.name'
    );
    $st->execute([$q, $q]);
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

    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename*=UTF-8\'\''.rawurlencode($doc['filename_original']));
    header('Content-Length: '.filesize($path));
    readfile($path); exit;
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

err('Маршрут не найден', 404);