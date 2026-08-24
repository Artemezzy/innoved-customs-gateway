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

function send_file_download(string $path, string $originalName, ?string $contentType = null): never {
    while (ob_get_level() > 0) { ob_end_clean(); }
    $mime = $contentType;
    if (!$mime && function_exists('finfo_open')) {
        $fi = finfo_open(FILEINFO_MIME_TYPE);
        if ($fi) { $mime = finfo_file($fi, $path) ?: null; finfo_close($fi); }
    }
    if (!$mime) {
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $map = [
            'pdf'  => 'application/pdf',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg', 'jpeg' => 'image/jpeg',
            'gif'  => 'image/gif', 'webp' => 'image/webp', 'svg'  => 'image/svg+xml',
            'zip'  => 'application/zip', 'rar'  => 'application/vnd.rar', '7z'   => 'application/x-7z-compressed',
            'doc'  => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls'  => 'application/vnd.ms-excel', 'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt'  => 'application/vnd.ms-powerpoint', 'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt'  => 'text/plain; charset=utf-8', 'csv'  => 'text/csv; charset=utf-8', 'json' => 'application/json; charset=utf-8', 'xml'  => 'application/xml; charset=utf-8',
        ];
        $mime = $map[$ext] ?? 'application/octet-stream';
    }
    $asciiName = preg_replace('/[^A-Za-z0-9._-]+/', '_', $originalName);
    if ($asciiName === '' || $asciiName === null) { $asciiName = 'file'; }
    header('Content-Type: ' . $mime, true);
    header('Content-Disposition: attachment; filename="' . $asciiName . '"; ' . "filename*=UTF-8''" . rawurlencode($originalName), true);
    header('Content-Length: ' . filesize($path));
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: private, no-store');
    header('Pragma: no-cache');
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
    preg_match('/Bearer\s+(\S+)/', $_SERVER['HTTP_AUTHORIZATION'] ?? '', $m);
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
    if ($me['role'] === 'cert_center' && (int)$r['cert_center_id'] !== (int)($me['cert_center_id'] ?? 0)) err('Нет доступа', 403);
    if (!in_array($me['role'], ['manager', 'cert_center'])) err('Нет доступа', 403);
    return $r;
}
function normalize_email_list(array $emails): array {
    $normalized = [];
    foreach ($emails as $email) {
        $email = mb_strtolower(trim((string)$email));
        if ($email === '') continue;
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) err('Некорректный email: ' . $email, 422);
        $normalized[$email] = true;
    }
    return array_keys($normalized);
}
function get_notification_emails(int $userId, ?string $fallbackEmail = null): array {
    $st = db()->prepare('SELECT email FROM lk_notification_emails WHERE user_id=? ORDER BY id ASC');
    $st->execute([$userId]);
    $emails = array_map(static fn(array $row) => mb_strtolower(trim((string)$row['email'])), $st->fetchAll());
    $emails = array_values(array_filter(array_unique($emails)));
    if (!$emails && $fallbackEmail) {
        $fallbackEmail = mb_strtolower(trim($fallbackEmail));
        if ($fallbackEmail !== '' && filter_var($fallbackEmail, FILTER_VALIDATE_EMAIL)) $emails = [$fallbackEmail];
    }
    return $emails;
}
function queue_notification(int $requestId, string $recipientRole, string $eventLine): void {
    $now = date('Y-m-d H:i:s');
    $st = db()->prepare("SELECT id, event_summary, events_count FROM lk_notification_queue WHERE entity_type='cert_request' AND entity_id=? AND recipient_role=? AND status='pending' LIMIT 1");
    $st->execute([$requestId, $recipientRole]);
    $existing = $st->fetch();
    if ($existing) {
        db()->prepare("UPDATE lk_notification_queue SET event_summary = CONCAT(event_summary, '\n', ?), events_count = events_count + 1, last_event_at = ? WHERE id = ?")
            ->execute([$eventLine, $now, $existing['id']]);
    } else {
        db()->prepare("INSERT INTO lk_notification_queue (entity_type, entity_id, recipient_role, event_summary, events_count, first_event_at, last_event_at, status) VALUES ('cert_request', ?, ?, ?, 1, ?, ?, 'pending')")
            ->execute([$requestId, $recipientRole, $eventLine, $now, $now]);
    }
}
function cert_request_number(int $id): string { return 'ИН-' . str_pad((string)$id, 6, '0', STR_PAD_LEFT); }
function doc_escape(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_XML1, 'UTF-8');
}
function doc_row(string $label, string $value): string {
    return '<w:tr>'
        . '<w:tc><w:tcPr><w:tcW w:w="3500" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' . doc_escape($label) . '</w:t></w:r></w:p></w:tc>'
        . '<w:tc><w:tcPr><w:tcW w:w="5500" w:type="dxa"/></w:tcPr><w:p><w:r><w:t xml:space="preserve">' . doc_escape($value) . '</w:t></w:r></w:p></w:tc>'
        . '</w:tr>';
}
function doc_title_row(string $title): string {
    return '<w:tr>'
        . '<w:tc><w:tcPr><w:gridSpan w:val="2"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>' . doc_escape($title) . '</w:t></w:r></w:p></w:tc>'
        . '</w:tr>';
}
function doc_table_xml(string $title, array $rows): string {
    $xml = '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>'
        . '<w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
        . '<w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
        . '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
        . '<w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
        . '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/>'
        . '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/>'
        . '</w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="3500"/><w:gridCol w:w="5500"/></w:tblGrid>';
    $xml .= doc_title_row($title);
    foreach ($rows as [$label, $value]) $xml .= doc_row($label, $value);
    $xml .= '</w:tbl>';
    return $xml;
}
function generate_cert_doc(array $request, array $items): string {
    $date = date('d/m/y');
    $title = 'Заявка на сертификацию продукции № ' . cert_request_number((int)$request['id']) . ' от ' . $date;
    $body = '';
    $body .= '<w:p><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>' . doc_escape($title) . '</w:t></w:r></w:p>';
    $body .= '<w:p><w:r><w:t>Заполняется клиентом:</w:t></w:r></w:p>';
    $body .= doc_table_xml('Заявитель', [
        ['Название организации', (string)$request['applicant_org']],
        ['Юридический адрес', (string)$request['applicant_address']],
        ['Телефон', ''],
        ['Факс', ''],
        ['ИНН', ''],
        ['КПП', ''],
        ['ОГРН и кем выдан', ''],
        ['ОКПО', ''],
        ['Руководитель', trim((string)$request['applicant_position'] . ' ' . (string)$request['applicant_head'])],
        ['Электронная почта', (string)$request['applicant_email']],
    ]);
    $body .= '<w:p/>';
    $body .= doc_table_xml('Изготовитель', [
        ['Название организации', (string)$request['manufacturer_org']],
        ['Адрес', (string)$request['manufacturer_address']],
        ['Страна', (string)$request['manufacturer_country']],
        ['Телефон', ''],
        ['Факс', ''],
        ['Филиалы завода', ''],
        ['Дополнительно', ''],
    ]);
    foreach ($items as $idx => $item) {
        $body .= '<w:p/>';
        $body .= doc_table_xml('Продукция' . (count($items) > 1 ? ' — товар ' . ($idx + 1) : ''), [
            ['Наименование продукции', (string)$item['product']],
            ['Техническое описание', (string)$item['tech_description']],
            ['Модель, артикул', (string)$item['model_article']],
            ['Торговая марка', (string)$item['trademark']],
            ['ОКП', ''],
            ['ТН ВЭД', (string)$item['tn_ved']],
            ['Контракт, договор, инвойс', (string)$item['contract_invoice']],
            ['Количество', (string)$item['quantity']],
            ['Дополнительно: ТУ, ГОСТ', (string)$item['comment']],
            ['ТР ТС', (string)$item['tr_ts']],
            ['Форма сертификации', (string)$item['cert_form']],
            ['Схема сертификации', (string)$item['cert_scheme']],
            ['Стоимость', (string)$item['cost']],
            ['Срок изготовления', (string)$item['production_deadline']],
            ['Необходимость образцов', (string)$item['samples_required']],
            ['В какой город доставлять образцы', (string)$item['samples_city']],
        ]);
    }
    $body .= '<w:p/>';
    $body .= '<w:p><w:r><w:t>* - заполняются обязательно</w:t></w:r></w:p>';
    $body .= '<w:p><w:r><w:t>ВНИМАНИЕ: Точно указывайте в заявке серийный выпуск на срок (1-3 года для ГОСТ Р и 1-5 лет для ТР), или партию с точным количеством продукции!</w:t></w:r></w:p>';

    $documentXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        . '<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"'
        . ' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"'
        . ' xmlns:o="urn:schemas-microsoft-com:office:office"'
        . ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
        . ' xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"'
        . ' xmlns:v="urn:schemas-microsoft-com:vml"'
        . ' xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"'
        . ' xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"'
        . ' xmlns:w10="urn:schemas-microsoft-com:office:word"'
        . ' xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
        . ' xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"'
        . ' xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"'
        . ' xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"'
        . ' xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"'
        . ' xmlns:wne="http://schemas.microsoft.com/office/2006/wordml"'
        . ' xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 wp14">'
        . '<w:body>' . $body
        . '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>'
        . '</w:body></w:document>';

    $contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        . '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        . '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        . '<Default Extension="xml" ContentType="application/xml"/>'
        . '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
        . '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        . '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
        . '</Types>';
    $rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        . '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        . '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
        . '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
        . '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
        . '</Relationships>';
    $docRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>';
    $core = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        . '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
        . '<dc:title>' . doc_escape($title) . '</dc:title><dc:creator>INNOVED LK</dc:creator></cp:coreProperties>';
    $app = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        . '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>INNOVED LK</Application></Properties>';

    $tmp = tempnam(sys_get_temp_dir(), 'cert_doc_');
    $zipPath = $tmp . '.docx';
    @unlink($tmp);
    $zip = new ZipArchive();
    if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) err('Не удалось создать файл заявки', 500);
    $zip->addFromString('[Content_Types].xml', $contentTypes);
    $zip->addFromString('_rels/.rels', $rels);
    $zip->addFromString('word/document.xml', $documentXml);
    $zip->addFromString('word/_rels/document.xml.rels', $docRels);
    $zip->addFromString('docProps/core.xml', $core);
    $zip->addFromString('docProps/app.xml', $app);
    $zip->close();
    return $zipPath;
}

// POST /api/auth/login
if ($method === 'POST' && $seg[0] === 'auth' && ($seg[1] ?? '') === 'login') {
    $b = body();
    $st = db()->prepare('SELECT * FROM lk_users WHERE email=? AND is_active=1 LIMIT 1');
    $st->execute([trim($b['email'] ?? '')]);
    $u = $st->fetch();
    if (!$u || !password_verify($b['password'] ?? '', $u['password_hash'])) err('Неверный email или пароль', 401);
    $token = jwt_make(['sub'=>$u['id'],'role'=>$u['role'],'client_id'=>$u['client_id'],'cert_center_id'=>$u['cert_center_id'] ?? null,'name'=>$u['name'],'exp'=>time() + 86400 * 7]);
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
        db()->rollBack(); err('Ошибка БД: '.$e->getMessage());
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
    auth(true);
    $clientId = (int)$seg[1];
    $st = db()->prepare('SELECT id, email, name FROM lk_users WHERE client_id=? AND role="client" AND is_active=1 LIMIT 1');
    $st->execute([$clientId]);
    $u = $st->fetch();
    if (!$u) err('Для этого клиента не найден пользователь с ролью client', 404);
    $newPass = gen_pass();
    $hash = password_hash($newPass, PASSWORD_BCRYPT);
    $upd = db()->prepare('UPDATE lk_users SET password_hash=?, updated_at=NOW() WHERE id=?');
    $upd->execute([$hash, $u['id']]);
    out(['user_id' => (int)$u['id'], 'login' => $u['email'], 'password' => $newPass]);
}

if ($method === 'GET' && $seg[0] === 'cert-requests' && !isset($seg[1])) {
    $me = auth();
    $sql = "SELECT r.*, cc.name AS cert_center_name, (SELECT i.company FROM lk_cert_request_items i WHERE i.request_id = r.id ORDER BY i.position_no ASC, i.id ASC LIMIT 1) AS company FROM lk_CERT_REQUESTS r JOIN lk_cert_centers cc ON cc.id = r.cert_center_id WHERE 1=1";
    $p = [];
    if ($me['role'] === 'cert_center') { $sql .= ' AND r.cert_center_id=?'; $p[] = $me['cert_center_id']; }
    elseif ($me['role'] !== 'manager') err('Недопустимая роль', 403);
    if (!empty($_GET['status'])) { $sql .= ' AND r.status=?'; $p[] = $_GET['status']; }
    if (!empty($_GET['cert_center_id']) && $me['role'] === 'manager') { $sql .= ' AND r.cert_center_id=?'; $p[] = (int)$_GET['cert_center_id']; }
    $sql .= ' ORDER BY r.created_at DESC';
    $st = db()->prepare($sql); $st->execute($p); $rows = $st->fetchAll();
    foreach ($rows as &$row) {
        $row['number'] = cert_request_number((int)$row['id']);
        $row['has_unread'] = $me['role'] === 'manager'
            ? (strtotime($row['updated_at']) > strtotime($row['manager_seen_at'] ?? '1970-01-01'))
            : (strtotime($row['updated_at']) > strtotime($row['center_seen_at'] ?? '1970-01-01'));
        $row['has_unread_messages'] = $row['has_unread'];
        $row['has_unread_changes'] = $row['has_unread'];
    }
    out($rows);
}

if ($method === 'POST' && $seg[0] === 'cert-requests' && !isset($seg[1])) {
    $me = auth(true); $b = body();
    if (empty($b['cert_center_id'])) err('cert_center_id обязателен');
    $certCenterId = (int)$b['cert_center_id'];
    $company = trim((string)($b['company'] ?? ''));
    $cc = db()->prepare('SELECT id FROM lk_cert_centers WHERE id=? AND is_active=1 LIMIT 1'); $cc->execute([$certCenterId]);
    if (!$cc->fetch()) err('Сертификационный центр не найден', 404);
    db()->beginTransaction();
    try {
        $st = db()->prepare("INSERT INTO lk_cert_requests(cert_center_id,status,created_by,created_at,updated_at,updated_by_role,manager_seen_at,center_seen_at,applicant_org,applicant_address,applicant_head,applicant_position,applicant_email,manufacturer_org,manufacturer_address,manufacturer_country) VALUES (?, 'open', ?, NOW(), NOW(), 'manager', NOW(), NULL, '', '', '', '', '', '', '', '')");
        $st->execute([$certCenterId, (int)$me['sub']]);
        $rid = (int)db()->lastInsertId();
        $stItem = db()->prepare("INSERT INTO lk_cert_request_items(request_id,position_no,is_checked,company,product,tn_ved,tech_description,model_article,trademark,contract_invoice,quantity,tr_ts,cert_form,cert_scheme,cost,production_deadline,samples_required,samples_city,comment,created_at,updated_at) VALUES (?, 1, 0, ?, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', NOW(), NOW())");
        $stItem->execute([$rid, $company]);
        db()->commit();
    } catch (\Throwable $e) {
        db()->rollBack(); err('Ошибка БД: '.$e->getMessage());
    }
    out(['id' => $rid], 201);
}

if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && !isset($seg[2])) {
    $me = auth(); $rid = (int)$seg[1]; $r = cert_request_guard($me, $rid);
    $seenCol = $me['role'] === 'manager' ? 'manager_seen_at' : 'center_seen_at';
    db()->prepare("UPDATE lk_cert_requests SET $seenCol=NOW() WHERE id=?")->execute([$rid]);
    $sti = db()->prepare('SELECT * FROM lk_cert_request_items WHERE request_id=? ORDER BY position_no ASC, id ASC');
    $sti->execute([$rid]); $items = $sti->fetchAll();
    foreach ($items as &$item) {
        $item['is_checked'] = (bool)$item['is_checked'];
    }
    $r['number'] = cert_request_number((int)$r['id']);
    $r['has_unread'] = false;
    $r['has_unread_messages'] = false;
    $r['has_unread_changes'] = false;
    out(['request' => $r, 'items' => $items, 'files' => []]);
}

if ($method === 'PUT' && $seg[0] === 'cert-requests' && isset($seg[1]) && !isset($seg[2])) {
    $me = auth();
    $rid = (int)$seg[1];
    cert_request_guard($me, $rid);
    $b = body();

    $requestInfoFields = ['applicant_org','applicant_address','applicant_head','applicant_position','applicant_email','manufacturer_org','manufacturer_address','manufacturer_country'];
    $requestInfoSet = []; $requestInfoVals = [];
    foreach ($requestInfoFields as $f) {
        if (array_key_exists($f, $b)) { $requestInfoSet[] = "$f=?"; $requestInfoVals[] = (string)$b[$f]; }
    }
    if ($requestInfoSet) {
        if ($me['role'] !== 'manager') err('Только менеджер может редактировать данные заявителя и изготовителя', 403);
        $requestInfoVals[] = $me['role'];
        $requestInfoVals[] = $rid;
        db()->prepare('UPDATE lk_cert_requests SET ' . implode(',', $requestInfoSet) . ', updated_at=NOW(), updated_by_role=? WHERE id=?')->execute($requestInfoVals);
        queue_notification($rid, 'cert_center', 'Обновлены данные заявителя/изготовителя');
        out(['ok' => true]);
    }

    $validStatuses = ['open','estimation','documents_pending','layout_approved','payment','certificate_issued','rejected','closed'];
    if (!in_array($b['status'] ?? '', $validStatuses, true)) err('Недопустимый статус');
    $seenCol = $me['role'] === 'manager' ? 'manager_seen_at' : 'center_seen_at';
    db()->prepare("UPDATE lk_cert_requests SET status=?, updated_at=NOW(), updated_by_role=?, $seenCol=NOW() WHERE id=?")->execute([$b['status'], $me['role'], $rid]);
    $statusLabels = ['open' => 'Открыто','estimation' => 'Просчёт','documents_pending' => 'Предоставление документов','layout_approved' => 'Макет согласован','payment' => 'Оплата','certificate_issued' => 'Сертификат выпущен','rejected' => 'Заявка отклонена','closed' => 'Закрыто'];
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager';
    queue_notification($rid, $recipientRole, "Статус изменён на «{$statusLabels[$b['status']]}»");
    out(['ok' => true]);
}

if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && !isset($seg[3])) {
    $me = auth(); $rid = (int)$seg[1]; cert_request_guard($me, $rid);
    $st = db()->prepare('SELECT * FROM lk_cert_request_items WHERE request_id=? ORDER BY position_no ASC, id ASC');
    $st->execute([$rid]); $items = $st->fetchAll();
    foreach ($items as &$item) $item['is_checked'] = (bool)$item['is_checked'];
    out($items);
}

if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'export') {
    $me  = auth(); $rid = (int)$seg[1]; $request = cert_request_guard($me, $rid);
    $sti = db()->prepare('SELECT i.position_no, i.company, i.product, i.tn_ved, i.tech_description, i.model_article, i.trademark, i.contract_invoice, i.quantity, i.tr_ts, i.cert_form, i.cert_scheme, i.cost, i.production_deadline, i.samples_required, i.samples_city, i.comment, cc.name AS cert_center_name FROM lk_cert_request_items i JOIN lk_cert_requests r ON r.id = i.request_id JOIN lk_cert_centers cc ON cc.id = r.cert_center_id WHERE i.request_id = ? ORDER BY i.position_no ASC, i.id ASC');
    $sti->execute([$rid]); $items = $sti->fetchAll();
    header('Pragma: public'); header('Expires: 0'); header('Cache-Control: must-revalidate, post-check=0, pre-check=0'); header('Cache-Control: private', false); header('Content-Description: File Transfer'); header('Content-Type: text/csv; charset=UTF-8'); header('Content-Disposition: attachment; filename="cert-request-' . $rid . '.csv"'); header('Content-Transfer-Encoding: binary');
    $out = fopen('php://output', 'w'); fwrite($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
    fputcsv($out, ['№ позиции','Компания','Наименование продукции','Техническое описание','Модель / артикул','Торговая марка','ТН ВЭД','Контракт / Договор / Инвойс','Количество','ТР ТС','Форма сертификации','Схема сертификации','Стоимость','Срок изготовления','Необходимость образцов','Город доставки образцов','Комментарий','Сертификационный центр','№ заявки','Дата создания','Статус'], ';');
    foreach ($items as $row) {
        fputcsv($out, [(int)$row['position_no'],(string)$row['company'],(string)$row['product'],(string)$row['tech_description'],(string)$row['model_article'],(string)$row['trademark'],(string)$row['tn_ved'],(string)$row['contract_invoice'],(string)$row['quantity'],(string)$row['tr_ts'],(string)$row['cert_form'],(string)$row['cert_scheme'],(string)$row['cost'],(string)$row['production_deadline'],(string)$row['samples_required'],(string)$row['samples_city'],(string)$row['comment'],(string)$row['cert_center_name'],(int)$request['id'],(string)$request['created_at'],(string)$request['status']], ';');
    }
    fclose($out); exit;
}

if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'generate-doc') {
    $me = auth(); $rid = (int)$seg[1]; $request = cert_request_guard($me, $rid);
    $itemIds = array_filter(array_map('intval', explode(',', (string)($_GET['item_ids'] ?? ''))));
    if (!$itemIds) err('Не выбраны товары для формирования заявки', 422);
    $placeholders = implode(',', array_fill(0, count($itemIds), '?'));
    $params = array_merge([$rid], $itemIds);
    $sql = "SELECT * FROM lk_cert_request_items WHERE request_id=? AND id IN ($placeholders) ORDER BY position_no ASC, id ASC";
    $st = db()->prepare($sql); $st->execute($params); $items = $st->fetchAll();
    if (!$items) err('Не найдены выбранные товары', 404);
    $docxPath = generate_cert_doc($request, $items);
    $downloadName = 'Zayavka-' . cert_request_number($rid) . '.docx';
    send_file_download($docxPath, $downloadName, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}

if ($method === 'POST' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && !isset($seg[3])) {
    $me = auth(); $rid = (int)$seg[1]; cert_request_guard($me, $rid); $b = body();
    $st = db()->prepare('SELECT COALESCE(MAX(position_no),0)+1 FROM lk_cert_request_items WHERE request_id=?'); $st->execute([$rid]); $nextPos = (int)$st->fetchColumn();
    $allowed = ['company','product','tech_description','model_article','trademark','tn_ved','contract_invoice','quantity','tr_ts','cert_form','cert_scheme','cost','production_deadline','samples_required','samples_city','comment'];
    $cols = ['request_id','position_no','is_checked']; $vals = [$rid, $nextPos, 0]; $marks = ['?','?','?'];
    foreach ($allowed as $f) { $cols[] = $f; $vals[] = $b[$f] ?? ''; $marks[] = '?'; }
    $sql = 'INSERT INTO lk_cert_request_items('.implode(',', $cols).',created_at,updated_at) VALUES('.implode(',', $marks).',NOW(),NOW())';
    db()->prepare($sql)->execute($vals);
    $itemId = (int)db()->lastInsertId();
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager';
    queue_notification($rid, $recipientRole, "Добавлена новая позиция товара №{$nextPos}");
    out(['id' => $itemId, 'position_no' => $nextPos], 201);
}

if ($method === 'PUT' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3])) {
    $me = auth(); $rid = (int)$seg[1]; $iid = (int)$seg[3]; cert_request_guard($me, $rid);
    $chk = db()->prepare('SELECT id FROM lk_cert_request_items WHERE id=? AND request_id=?'); $chk->execute([$iid, $rid]);
    if (!$chk->fetch()) err('Позиция не найдена', 404);
    $b = body();
    $allowed = ['is_checked','company','product','tech_description','model_article','trademark','tn_ved','contract_invoice','quantity','tr_ts','cert_form','cert_scheme','cost','production_deadline','samples_required','samples_city','comment'];
    $set = []; $vals = [];
    foreach ($allowed as $f) if (array_key_exists($f, $b)) { $set[] = "$f=?"; $vals[] = $f === 'is_checked' ? (int)!empty($b[$f]) : $b[$f]; }
    if (!$set) err('Нет данных для обновления');
    $vals[] = $iid;
    db()->prepare('UPDATE lk_cert_request_items SET '.implode(',', $set).', updated_at=NOW() WHERE id=?')->execute($vals);
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager';
    queue_notification($rid, $recipientRole, 'Обновлены данные по товарной позиции');
    out(['ok' => true]);
}

if ($method === 'DELETE' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3])) {
    $me = auth(); $rid = (int)$seg[1]; $iid = (int)$seg[3]; cert_request_guard($me, $rid);
    $cnt = (int) db()->query("SELECT COUNT(*) FROM lk_cert_request_items WHERE request_id=$rid")->fetchColumn();
    if ($cnt <= 1) err('В заявке должна остаться хотя бы одна позиция товара');
    db()->prepare('DELETE FROM lk_cert_request_items WHERE id=? AND request_id=?')->execute([$iid, $rid]);
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager';
    queue_notification($rid, $recipientRole, 'Удалена товарная позиция');
    out(['ok' => true]);
}

if ($method === 'DELETE' && $seg[0] === 'cert-requests' && isset($seg[1]) && !isset($seg[2])) {
    auth(true); $rid = (int)$seg[1]; $st = db()->prepare('SELECT id FROM lk_cert_requests WHERE id=?'); $st->execute([$rid]); if (!$st->fetch()) err('Заявка не найдена', 404); db()->prepare('DELETE FROM lk_cert_requests WHERE id=?')->execute([$rid]); out(['ok' => true]);
}

if ($method === 'POST' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files') {
    $me  = auth(); $rid = (int)$seg[1]; $iid = (int)$seg[3]; cert_request_guard($me, $rid);
    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?'); $stItem->execute([$iid]); $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) err('Позиция товара не найдена или не принадлежит заявке', 404);
    if (!empty($_POST['url'])) {
        db()->prepare('INSERT INTO lk_cert_request_files(request_id,item_id,file_type,url,uploader_id,uploader_role,created_at) VALUES(?,?,?,?,?,?,NOW())')->execute([$rid, $iid, 'link', $_POST['url'], $me['sub'], $me['role']]);
        db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
        $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager'; queue_notification($rid, $recipientRole, 'Добавлена ссылка на вложение'); out(['ok' => true], 201);
    }
    if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) err('Файл не загружен');
    $file = $_FILES['file']; if ($file['size'] > MAX_FILE_SIZE) err('Файл слишком большой (макс. 20 МБ)');
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['pdf','doc','docx','xls','xlsx','jpg','jpeg','png'])) err('Недопустимый тип файла');
    $dir = UPLOAD_PATH.'/cert/'.$rid; if (!is_dir($dir)) mkdir($dir, 0755, true); $stored = uniqid('cf_').'.'.$ext;
    if (!move_uploaded_file($file['tmp_name'], $dir.'/'.$stored)) err('Ошибка сохранения файла');
    db()->prepare('INSERT INTO lk_cert_request_files(request_id,item_id,file_type,filename_original,filename_stored,uploader_id,uploader_role,created_at) VALUES(?,?,?,?,?,?,?,NOW())')->execute([$rid, $iid, 'file', $file['name'], $stored, $me['sub'], $me['role']]);
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager'; queue_notification($rid, $recipientRole, "Добавлен файл: {$file['name']}"); out(['id' => (int)db()->lastInsertId()], 201);
}

if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files' && isset($seg[5]) && ($seg[6] ?? '') === 'download') {
    $me  = auth(); $rid = (int)$seg[1]; $iid = (int)$seg[3]; $fid = (int)$seg[5]; cert_request_guard($me, $rid);
    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?'); $stItem->execute([$iid]); $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) err('Позиция товара не найдена или не принадлежит заявке', 404);
    $st = db()->prepare('SELECT * FROM lk_cert_request_files WHERE id=? AND request_id=? AND item_id=?'); $st->execute([$fid, $rid, $iid]); $f = $st->fetch(); if (!$f || $f['file_type'] !== 'file') err('Не найдено', 404);
    $path = UPLOAD_PATH.'/cert/'.$rid.'/'.$f['filename_stored']; if (!file_exists($path)) err('Файл не найден', 404);
    send_file_download($path, $f['filename_original']);
}

if ($method === 'DELETE' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files' && isset($seg[5]) && !isset($seg[6])) {
    $me  = auth(); $rid = (int)$seg[1]; $iid = (int)$seg[3]; $fid = (int)$seg[5]; cert_request_guard($me, $rid);
    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?'); $stItem->execute([$iid]); $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) err('Позиция товара не найдена или не принадлежит заявке', 404);
    $stFile = db()->prepare('SELECT * FROM lk_cert_request_files WHERE id=? AND request_id=? AND item_id=?'); $stFile->execute([$fid, $rid, $iid]); $file = $stFile->fetch(); if (!$file) err('Вложение не найдено', 404);
    if ($file['file_type'] === 'file' && !empty($file['filename_stored'])) { $path = UPLOAD_PATH.'/cert/'.$rid.'/'.$file['filename_stored']; if (file_exists($path)) @unlink($path); }
    db()->prepare('DELETE FROM lk_cert_request_files WHERE id=? AND request_id=? AND item_id=?')->execute([$fid, $rid, $iid]);
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager'; queue_notification($rid, $recipientRole, 'Удалено вложение'); out(['ok' => true]);
}

if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files' && !isset($seg[5])) {
    $me  = auth(); $rid = (int)$seg[1]; $iid = (int)$seg[3]; cert_request_guard($me, $rid);
    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?'); $stItem->execute([$iid]); $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) err('Позиция товара не найдена или не принадлежит заявке', 404);
    $st = db()->prepare('SELECT * FROM lk_cert_request_files WHERE request_id=? AND item_id=? ORDER BY created_at DESC'); $st->execute([$rid, $iid]); out($st->fetchAll());
}

if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'messages') {
    $me = auth(); $rid = (int)$seg[1]; cert_request_guard($me, $rid); $since = $_GET['since'] ?? '1970-01-01 00:00:00';
    $st = db()->prepare('SELECT m.*, u.name AS sender_name FROM lk_cert_messages m JOIN lk_users u ON u.id=m.user_id WHERE m.request_id=? AND m.created_at>? ORDER BY m.created_at ASC');
    $st->execute([$rid, $since]); $other = $me['role'] === 'manager' ? 'cert_center' : 'manager'; db()->prepare('UPDATE lk_cert_messages SET is_read=1 WHERE request_id=? AND role=? AND is_read=0')->execute([$rid, $other]); out($st->fetchAll());
}

if ($method === 'POST' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'messages') {
    $me = auth(); $rid = (int)$seg[1]; cert_request_guard($me, $rid); $text = trim(body()['text'] ?? ''); if (!$text) err('Пустое сообщение');
    db()->prepare('INSERT INTO lk_cert_messages(request_id,user_id,role,text,is_read,created_at) VALUES(?,?,?,?,0,NOW())')->execute([$rid, $me['sub'], $me['role'], $text]);
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager'; $preview = mb_substr($text, 0, 80); queue_notification($rid, $recipientRole, "Новое сообщение: «{$preview}»"); out(['id' => (int)db()->lastInsertId()], 201);
}

if ($method === 'GET' && $seg[0] === 'me' && ($seg[1] ?? '') === 'notifications') {
    $me = auth(); $st = db()->prepare('SELECT email FROM lk_users WHERE id=?'); $st->execute([$me['sub']]); $user = $st->fetch(); if (!$user) err('Пользователь не найден', 404);
    out(['emails' => get_notification_emails((int)$me['sub'], (string)$user['email'])]);
}
if ($method === 'PUT' && $seg[0] === 'me' && ($seg[1] ?? '') === 'notifications') {
    $me = auth(); $b = body(); $emails = normalize_email_list((array)($b['emails'] ?? []));
    db()->beginTransaction();
    try {
        db()->prepare('DELETE FROM lk_notification_emails WHERE user_id=?')->execute([$me['sub']]);
        if ($emails) { $ins = db()->prepare('INSERT INTO lk_notification_emails(user_id,email,created_at) VALUES(?,?,NOW())'); foreach ($emails as $email) $ins->execute([$me['sub'], $email]); }
        db()->commit();
    } catch (\Throwable $e) { db()->rollBack(); err('Ошибка БД: ' . $e->getMessage()); }
    out(['ok' => true]);
}

if ($method === 'GET' && $seg[0] === 'managers' && ($seg[1] ?? '') === 'cert-stats') {
    auth(true);
    out(['cert_centers_count' => (int) db()->query('SELECT COUNT(*) FROM lk_cert_centers WHERE is_active=1')->fetchColumn(), 'cert_requests_open' => (int) db()->query("SELECT COUNT(*) FROM lk_cert_requests WHERE status!='closed'")->fetchColumn()]);
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
        'SELECT m*, u.name AS sender_name
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

// GET /api/cert-centers
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

// POST /api/cert-centers
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
            'INSERT INTO lk_cert_centers(name,email,phone,is_active,created_at)
             VALUES(?,?,?,?,NOW())'
        );
        $st->execute([
            $b['name'],
            $b['email'],
            $b['phone'] ?? '',
            1,
        ]);
        $ccId = (int)db()->lastInsertId();
        $st2 = db()->prepare(
            'INSERT INTO lk_users(email,password_hash,name,role,cert_center_id,is_active,created_at)
             VALUES(?,?,?,?,?,1,NOW())'
        );
        $st2->execute([
            $b['email'],
            $hash,
            $b['name'],
            'cert_center',
            $ccId,
        ]);
        db()->commit();
    } catch (\Throwable $e) {
        db()->rollBack(); err('Ошибка БД: '.$e->getMessage());
    }
    out(['cert_center_id' => $ccId, 'login' => $b['email'], 'password' => $pass], 201);
}

err('Маршрут не найден', 404);
