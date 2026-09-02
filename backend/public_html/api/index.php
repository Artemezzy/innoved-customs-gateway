<?php
declare(strict_types=1);
error_reporting(0);
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . FRONTEND_ORIGIN);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim(preg_replace('#^/api#', '', $uri), '/');
$seg = explode('/', $path);

function db(): PDO {
    static $pdo = null;
    if (!$pdo) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
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
            'pdf' => 'application/pdf',
            'png' => 'image/png',
            'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
            'gif' => 'image/gif', 'webp' => 'image/webp', 'svg' => 'image/svg+xml',
            'zip' => 'application/zip', 'rar' => 'application/vnd.rar', '7z' => 'application/x-7z-compressed',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel', 'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt' => 'application/vnd.ms-powerpoint', 'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt' => 'text/plain; charset=utf-8', 'csv' => 'text/csv; charset=utf-8', 'json' => 'application/json; charset=utf-8', 'xml' => 'application/xml; charset=utf-8',
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

/**
 * ОБНОВЛЕНО: теперь принимает $entityType первым параметром.
 * Поддерживает 'cert_request' (как раньше) и 'shipment' (новое).
 */
function queue_notification(string $entityType, int $entityId, string $recipientRole, string $eventLine): void {
    $now = date('Y-m-d H:i:s');
    $st = db()->prepare("SELECT id, event_summary, events_count FROM lk_notification_queue WHERE entity_type=? AND entity_id=? AND recipient_role=? AND status='pending' LIMIT 1");
    $st->execute([$entityType, $entityId, $recipientRole]);
    $existing = $st->fetch();
    if ($existing) {
        db()->prepare("UPDATE lk_notification_queue SET event_summary = CONCAT(event_summary, '\n', ?), events_count = events_count + 1, last_event_at = ? WHERE id = ?")
            ->execute([$eventLine, $now, $existing['id']]);
    } else {
        db()->prepare("INSERT INTO lk_notification_queue (entity_type, entity_id, recipient_role, event_summary, events_count, first_event_at, last_event_at, status) VALUES (?, ?, ?, ?, 1, ?, ?, 'pending')")
            ->execute([$entityType, $entityId, $recipientRole, $eventLine, $now, $now]);
    }
}

const CHAT_ALLOWED_EXT = ['pdf','doc','docx','xls','xlsx','jpg','jpeg','png','txt','zip'];

function handle_chat_attachment(): ?array {
    if (empty($_FILES['file']) || $_FILES['file']['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        err('Ошибка загрузки файла', 400);
    }
    $file = $_FILES['file'];
    if ($file['size'] > MAX_FILE_SIZE) err('Файл слишком большой (макс. 20 МБ)', 400);
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, CHAT_ALLOWED_EXT, true)) err('Недопустимый тип файла', 400);
    return $file;
}

function store_chat_attachment(array $file, string $subdir): array {
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $dir = UPLOAD_PATH . '/' . $subdir;
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $stored = uniqid('msg_') . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $stored)) {
        err('Ошибка сохранения файла', 500);
    }
    return [
        'original' => $file['name'],
        'stored' => $stored,
        'size' => (int)$file['size'],
    ];
}

function next_document_number(string $entityType, int $entityId): int {
    db()->prepare("INSERT INTO lk_document_sequence(entity_type,entity_id,created_at) VALUES(?,?,NOW())")
        ->execute([$entityType, $entityId]);
    return (int)db()->lastInsertId();
}

function document_number_label(?int $number): string {
    return 'ИН-' . str_pad((string)($number ?? 0), 6, '0', STR_PAD_LEFT);
}

function shipment_guard(array $me, int $sid): array {
    $st = db()->prepare('SELECT * FROM lk_shipments WHERE id=?');
    $st->execute([$sid]);
    $s = $st->fetch();
    if (!$s) err('Поставка не найдена', 404);
    if ($me['role'] === 'client' && (int)$s['client_id'] !== (int)($me['client_id'] ?? 0)) err('Нет доступа', 403);
    if (!in_array($me['role'], ['manager', 'client'])) err('Нет доступа', 403);
    return $s;
}

/**
 * Проверяет доступ к справочнику организаций конкретного клиента.
 *
 * manager: может работать с профилями любого клиента.
 * client: только с профилями собственного client_id из JWT.
 * cert_center: не имеет доступа.
 */
function organization_profiles_guard(array $me, int $clientId): void {
    if (!in_array($me['role'], ['manager', 'client'], true)) {
        err('Нет доступа', 403);
    }

    if (
        $me['role'] === 'client'
        && $clientId !== (int)($me['client_id'] ?? 0)
    ) {
        err('Нет доступа', 403);
    }

    $st = db()->prepare(
        'SELECT id FROM lk_clients WHERE id=? AND is_active=1 LIMIT 1'
    );
    $st->execute([$clientId]);

    if (!$st->fetch()) {
        err('Клиент не найден', 404);
    }
}

/**
 * Проверяет тип профиля организации.
 */
function organization_profile_type(string $type): string {
    if (!in_array($type, ['applicant', 'manufacturer'], true)) {
        err('Недопустимый тип организации', 422);
    }

    return $type;
}

/**
 * Подготавливает и валидирует поля профиля.
 *
 * applicant: обязательны name, address, email.
 * manufacturer: обязательны name, address, country.
 */
function organization_profile_payload(array $data, string $type): array {
    $name = trim((string)($data['name'] ?? ''));
    $address = trim((string)($data['address'] ?? ''));
    $head = trim((string)($data['head'] ?? ''));
    $position = trim((string)($data['position'] ?? ''));
    $email = trim((string)($data['email'] ?? ''));
    $country = trim((string)($data['country'] ?? ''));

    if ($name === '') {
        err('Укажите название организации', 422);
    }

    if ($address === '') {
        err('Укажите адрес организации', 422);
    }

    if ($type === 'applicant' && $email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        err('Укажите корректный email заявителя', 422);
    }

    return [
        'name' => $name,
        'address' => $address,
        'head' => $head,
        'position' => $position,
        'email' => $email,
        'country' => $country,
    ];
}

function doc_escape(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_XML1, 'UTF-8');
}
function doc_row(string $label, string $value): string {
    return '<w:tr><w:tc><w:tcPr><w:tcW w:w="3500" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' . doc_escape($label) . '</w:t></w:r></w:p></w:tc>'
        . '<w:tc><w:tcPr><w:tcW w:w="5500" w:type="dxa"/></w:tcPr><w:p><w:r><w:t xml:space="preserve">' . doc_escape($value) . '</w:t></w:r></w:p></w:tc></w:tr>';
}
function doc_title_row(string $title): string {
    return '<w:tr><w:tc><w:tcPr><w:gridSpan w:val="2"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>' . doc_escape($title) . '</w:t></w:r></w:p></w:tc></w:tr>';
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

/**
 * Создаёт один DOCX по Word-шаблону для одной товарной позиции.
 *
 * Шаблон:
 *   backend/public_html/api/templates/cert-request-template.docx
 *
 * Важно: DOCX — ZIP-архив. Мы копируем его целиком и заменяем
 * маркеры только в word/document.xml, поэтому форматирование,
 * таблицы, колонтитулы, стили и изображения шаблона сохраняются.
 */
function generate_cert_doc(array $request, array $item): string {
    $templatePath = __DIR__ . '/templates/cert-request-template.docx';

    if (!is_file($templatePath) || !is_readable($templatePath)) {
        err('Не найден или недоступен шаблон заявки: ' . $templatePath, 500);
    }

    $number = document_number_label(
        isset($request['document_number']) ? (int)$request['document_number'] : null
    );

    $variables = [
        '{{request_number}}' => $number,
        '{{request_date}}' => date('d.m.Y'),

        '{{applicant_org}}' => (string)($request['applicant_org'] ?? ''),
        '{{applicant_address}}' => (string)($request['applicant_address'] ?? ''),
        '{{applicant_position}}' => (string)($request['applicant_position'] ?? ''),
        '{{applicant_head}}' => (string)($request['applicant_head'] ?? ''),
        '{{applicant_email}}' => (string)($request['applicant_email'] ?? ''),

        '{{manufacturer_org}}' => (string)($request['manufacturer_org'] ?? ''),
        '{{manufacturer_address}}' => (string)($request['manufacturer_address'] ?? ''),
        '{{manufacturer_country}}' => (string)($request['manufacturer_country'] ?? ''),

        '{{product}}' => (string)($item['product'] ?? ''),
        '{{model_article}}' => (string)($item['model_article'] ?? ''),
        '{{trademark}}' => (string)($item['trademark'] ?? ''),
        '{{tn_ved}}' => (string)($item['tn_ved'] ?? ''),
        '{{contract_invoice}}' => (string)($item['contract_invoice'] ?? ''),
        '{{quantity}}' => (string)($item['quantity'] ?? ''),
    ];

    $tmpBase = tempnam(sys_get_temp_dir(), 'cert_template_');
    if ($tmpBase === false) {
        err('Не удалось создать временный файл', 500);
    }

    $outputPath = $tmpBase . '.docx';
    @unlink($tmpBase);

    if (!copy($templatePath, $outputPath)) {
        err('Не удалось скопировать шаблон заявки', 500);
    }

    $zip = new ZipArchive();
    if ($zip->open($outputPath) !== true) {
        @unlink($outputPath);
        err('Не удалось открыть DOCX-шаблон', 500);
    }

    $xml = $zip->getFromName('word/document.xml');
    if ($xml === false) {
        $zip->close();
        @unlink($outputPath);
        err('В шаблоне отсутствует word/document.xml', 500);
    }

    /*
     * Экранируем значения именно как XML-текст:
     * амперсанды, угловые скобки и кавычки не должны ломать DOCX.
     *
     * МАРКЕРЫ в Word должны быть цельными строками, например:
     * {{applicant_org}}
     * Нельзя разбивать один маркер разными стилями/форматированием.
     */
    $replace = [];
    foreach ($variables as $marker => $value) {
        $replace[$marker] = htmlspecialchars(
            trim($value),
            ENT_QUOTES | ENT_XML1,
            'UTF-8'
        );
    }

    $xml = strtr($xml, $replace);

    if ($zip->addFromString('word/document.xml', $xml) === false) {
        $zip->close();
        @unlink($outputPath);
        err('Не удалось заполнить шаблон заявки', 500);
    }

    $zip->close();

    return $outputPath;
}

// GET /api/organization-profiles?client_id=123&type=applicant
if ($method === 'GET' && $seg[0] === 'organization-profiles' && !isset($seg[1])) {
    $me = auth();

    $clientId = (int)($_GET['client_id'] ?? 0);
    $type = organization_profile_type((string)($_GET['type'] ?? ''));

    if ($clientId <= 0) {
        err('client_id обязателен', 422);
    }

    organization_profiles_guard($me, $clientId);

    $st = db()->prepare(
        'SELECT
            id,
            client_id,
            profile_type,
            name,
            address,
            head,
            position,
            email,
            country,
            created_by_user_id,
            created_at,
            updated_at
         FROM lk_organization_profiles
         WHERE client_id=? AND profile_type=?
         ORDER BY name ASC, id ASC'
    );

    $st->execute([$clientId, $type]);
    out($st->fetchAll());
}

// GET /api/organization-profiles/check?client_id=123&type=applicant&name=...
if (
    $method === 'GET'
    && $seg[0] === 'organization-profiles'
    && ($seg[1] ?? '') === 'check'
) {
    $me = auth();

    $clientId = (int)($_GET['client_id'] ?? 0);
    $type = organization_profile_type((string)($_GET['type'] ?? ''));
    $name = trim((string)($_GET['name'] ?? ''));

    if ($clientId <= 0) {
        err('client_id обязателен', 422);
    }

    if ($name === '') {
        err('name обязателен', 422);
    }

    organization_profiles_guard($me, $clientId);

    $st = db()->prepare(
        'SELECT
            id,
            client_id,
            profile_type,
            name,
            address,
            head,
            position,
            email,
            country,
            created_by_user_id,
            created_at,
            updated_at
         FROM lk_organization_profiles
         WHERE client_id=?
           AND profile_type=?
           AND LOWER(TRIM(name)) = LOWER(TRIM(?))
         ORDER BY id ASC
         LIMIT 1'
    );

    $st->execute([$clientId, $type, $name]);
    $profile = $st->fetch();

    out([
        'exists' => (bool)$profile,
        'profile' => $profile ?: null,
    ]);
}

// POST /api/organization-profiles
if ($method === 'POST' && $seg[0] === 'organization-profiles' && !isset($seg[1])) {
    $me = auth();
    $data = body();

    $clientId = (int)($data['client_id'] ?? 0);
    $type = organization_profile_type((string)($data['profile_type'] ?? ''));

    if ($clientId <= 0) {
        err('client_id обязателен', 422);
    }

    organization_profiles_guard($me, $clientId);

    $profile = organization_profile_payload($data, $type);

    $st = db()->prepare(
        'INSERT INTO lk_organization_profiles(
            client_id,
            profile_type,
            name,
            address,
            head,
            position,
            email,
            country,
            created_by_user_id,
            created_at,
            updated_at
         ) VALUES(?,?,?,?,?,?,?,?,?,NOW(),NOW())'
    );

    $st->execute([
        $clientId,
        $type,
        $profile['name'],
        $profile['address'],
        $profile['head'],
        $profile['position'],
        $profile['email'],
        $profile['country'],
        (int)$me['sub'],
    ]);

    $id = (int)db()->lastInsertId();

    $created = db()->prepare(
        'SELECT
            id,
            client_id,
            profile_type,
            name,
            address,
            head,
            position,
            email,
            country,
            created_by_user_id,
            created_at,
            updated_at
         FROM lk_organization_profiles
         WHERE id=?'
    );
    $created->execute([$id]);

    out($created->fetch(), 201);
}

// PUT /api/organization-profiles/:id
if (
    $method === 'PUT'
    && $seg[0] === 'organization-profiles'
    && isset($seg[1])
    && !isset($seg[2])
) {
    $me = auth();
    $profileId = (int)$seg[1];

    $existingSt = db()->prepare(
        'SELECT * FROM lk_organization_profiles WHERE id=? LIMIT 1'
    );
    $existingSt->execute([$profileId]);
    $existing = $existingSt->fetch();

    if (!$existing) {
        err('Организация не найдена', 404);
    }

    organization_profiles_guard($me, (int)$existing['client_id']);

    $data = body();
    $type = organization_profile_type((string)$existing['profile_type']);
    $profile = organization_profile_payload($data, $type);

    db()->prepare(
        'UPDATE lk_organization_profiles
         SET
            name=?,
            address=?,
            head=?,
            position=?,
            email=?,
            country=?,
            updated_at=NOW()
         WHERE id=?'
    )->execute([
        $profile['name'],
        $profile['address'],
        $profile['head'],
        $profile['position'],
        $profile['email'],
        $profile['country'],
        $profileId,
    ]);

    $updatedSt = db()->prepare(
        'SELECT
            id,
            client_id,
            profile_type,
            name,
            address,
            head,
            position,
            email,
            country,
            created_by_user_id,
            created_at,
            updated_at
         FROM lk_organization_profiles
         WHERE id=?'
    );
    $updatedSt->execute([$profileId]);

    out($updatedSt->fetch());
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
        'clients_count' => (int) db()->query('SELECT COUNT(*) FROM lk_clients WHERE is_active=1')->fetchColumn(),
        'shipments_active' => (int) db()->query("SELECT COUNT(*) FROM lk_shipments WHERE status NOT IN('released','on_hold')")->fetchColumn(),
        'messages_unread' => (int) db()->query("SELECT COUNT(*) FROM lk_messages WHERE is_read=0 AND role='client'")->fetchColumn(),
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
    out([
        'user_id' => (int)$u['id'],
        'client_id' => $clientId,
        'login' => $u['email'],
        'name' => $u['name'],
        'new_password' => $newPass,
    ]);
}

// DELETE /api/clients/:id (soft-delete: деактивация клиента + его пользователя)
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

if ($method === 'GET' && $seg[0] === 'cert-requests' && !isset($seg[1])) {
    $me = auth();
    $sql = "SELECT r.*, cc.name AS cert_center_name, (SELECT i.company FROM lk_cert_request_items i WHERE i.request_id = r.id ORDER BY i.position_no ASC, i.id ASC LIMIT 1) AS company FROM lk_cert_requests r JOIN lk_cert_centers cc ON cc.id = r.cert_center_id WHERE 1=1";
    $p = [];
    if ($me['role'] === 'cert_center') { $sql .= ' AND r.cert_center_id=?'; $p[] = $me['cert_center_id']; }
    elseif ($me['role'] !== 'manager') err('Недопустимая роль', 403);
    if (!empty($_GET['status'])) { $sql .= ' AND r.status=?'; $p[] = $_GET['status']; }
    if (!empty($_GET['cert_center_id']) && $me['role'] === 'manager') { $sql .= ' AND r.cert_center_id=?'; $p[] = (int)$_GET['cert_center_id']; }
    $sql .= ' ORDER BY r.created_at DESC';
    $st = db()->prepare($sql); $st->execute($p); $rows = $st->fetchAll();
    foreach ($rows as &$row) {
        $row['number'] = document_number_label($row['document_number'] ?? null);
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
    $r['number'] = document_number_label($r['document_number'] ?? null);
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
        queue_notification('cert_request', $rid, 'cert_center', 'Обновлены данные заявителя/изготовителя');
        out(['ok' => true]);
    }
    $validStatuses = ['open','estimation','documents_pending','layout_approved','payment','certificate_issued','rejected','closed'];
    if (!in_array($b['status'] ?? '', $validStatuses, true)) err('Недопустимый статус');
    $seenCol = $me['role'] === 'manager' ? 'manager_seen_at' : 'center_seen_at';
    db()->prepare("UPDATE lk_cert_requests SET status=?, updated_at=NOW(), updated_by_role=?, $seenCol=NOW() WHERE id=?")->execute([$b['status'], $me['role'], $rid]);
    $statusLabels = ['open' => 'Открыто','estimation' => 'Просчёт','documents_pending' => 'Предоставление документов','layout_approved' => 'Макет согласован','payment' => 'Оплата','certificate_issued' => 'Сертификат выпущен','rejected' => 'Заявка отклонена','closed' => 'Закрыто'];
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager';
    queue_notification('cert_request', $rid, $recipientRole, "Статус изменён на «{$statusLabels[$b['status']]}»");
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
    $me = auth(); $rid = (int)$seg[1]; $request = cert_request_guard($me, $rid);
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

// GET /api/cert-requests/:id/generate-doc?item_ids=1,2,3
//
// Одна отмеченная позиция  → один DOCX.
// Несколько позиций        → ZIP с отдельным DOCX на каждую позицию.
if (
    $method === 'GET'
    && $seg[0] === 'cert-requests'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'generate-doc'
) {
    $me = auth();
    $rid = (int)$seg[1];
    $request = cert_request_guard($me, $rid);

    $itemIds = array_values(array_unique(array_filter(
        array_map(
            'intval',
            explode(',', (string)($_GET['item_ids'] ?? ''))
        )
    )));

    if (!$itemIds) {
        err('Не выбраны товары для формирования заявки', 422);
    }

    $placeholders = implode(',', array_fill(0, count($itemIds), '?'));
    $params = array_merge([$rid], $itemIds);

    $st = db()->prepare(
        "SELECT *
         FROM lk_cert_request_items
         WHERE request_id=? AND id IN ($placeholders)
         ORDER BY position_no ASC, id ASC"
    );
    $st->execute($params);
    $items = $st->fetchAll();

    if (count($items) !== count($itemIds)) {
        err('Не найдены одна или несколько выбранных товарных позиций', 404);
    }

    $requestNumber = document_number_label(
        isset($request['document_number']) ? (int)$request['document_number'] : null
    );

    // Одна позиция: сразу скачиваем один DOCX.
    if (count($items) === 1) {
        $item = $items[0];
        $docxPath = generate_cert_doc($request, $item);

        $filename = 'Заявка-' . $requestNumber
            . '-позиция-' . (int)$item['position_no']
            . '.docx';

        send_file_download(
            $docxPath,
            $filename,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
    }

    // Несколько позиций: создаём ZIP, один DOCX на каждую позицию.
    $tmpBase = tempnam(sys_get_temp_dir(), 'cert_requests_zip_');
    if ($tmpBase === false) {
        err('Не удалось создать временный архив', 500);
    }

    $zipPath = $tmpBase . '.zip';
    @unlink($tmpBase);

    $zip = new ZipArchive();
    if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        @unlink($zipPath);
        err('Не удалось создать ZIP-архив', 500);
    }

    $generatedPaths = [];

    try {
        foreach ($items as $item) {
            $docxPath = generate_cert_doc($request, $item);
            $generatedPaths[] = $docxPath;

            $filenameInZip = 'Заявка-' . $requestNumber
                . '-позиция-' . (int)$item['position_no']
                . '.docx';

            if (!$zip->addFile($docxPath, $filenameInZip)) {
                throw new RuntimeException('Не удалось добавить документ в ZIP');
            }
        }

        $zip->close();
    } catch (Throwable $e) {
        $zip->close();

        foreach ($generatedPaths as $path) {
            if (is_file($path)) {
                @unlink($path);
            }
        }

        if (is_file($zipPath)) {
            @unlink($zipPath);
        }

        err('Не удалось сформировать документы: ' . $e->getMessage(), 500);
    }

    foreach ($generatedPaths as $path) {
        if (is_file($path)) {
            @unlink($path);
        }
    }

    send_file_download(
        $zipPath,
        'Заявка-' . $requestNumber . '-позиции.zip',
        'application/zip'
    );
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
    queue_notification('cert_request', $rid, $recipientRole, "Добавлена новая позиция товара №{$nextPos}");
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
    queue_notification('cert_request', $rid, $recipientRole, 'Обновлены данные по товарной позиции');
    out(['ok' => true]);
}

if ($method === 'DELETE' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3])) {
    $me = auth(); $rid = (int)$seg[1]; $iid = (int)$seg[3]; cert_request_guard($me, $rid);
    $cnt = (int) db()->query("SELECT COUNT(*) FROM lk_cert_request_items WHERE request_id=$rid")->fetchColumn();
    if ($cnt <= 1) err('В заявке должна остаться хотя бы одна позиция товара');
    db()->prepare('DELETE FROM lk_cert_request_items WHERE id=? AND request_id=?')->execute([$iid, $rid]);
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager';
    queue_notification('cert_request', $rid, $recipientRole, 'Удалена товарная позиция');
    out(['ok' => true]);
}

if ($method === 'DELETE' && $seg[0] === 'cert-requests' && isset($seg[1]) && !isset($seg[2])) {
    auth(true); $rid = (int)$seg[1]; $st = db()->prepare('SELECT id FROM lk_cert_requests WHERE id=?'); $st->execute([$rid]); if (!$st->fetch()) err('Заявка не найдена', 404); db()->prepare('DELETE FROM lk_cert_requests WHERE id=?')->execute([$rid]); out(['ok' => true]);
}

if ($method === 'POST' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files') {
    $me = auth(); $rid = (int)$seg[1]; $iid = (int)$seg[3]; cert_request_guard($me, $rid);
    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?'); $stItem->execute([$iid]); $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) err('Позиция товара не найдена или не принадлежит заявке', 404);
    if (!empty($_POST['url'])) {
        db()->prepare('INSERT INTO lk_cert_request_files(request_id,item_id,file_type,url,uploader_id,uploader_role,created_at) VALUES(?,?,?,?,?,?,NOW())')->execute([$rid, $iid, 'link', $_POST['url'], $me['sub'], $me['role']]);
        db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
        $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager'; queue_notification('cert_request', $rid, $recipientRole, 'Добавлена ссылка на вложение'); out(['ok' => true], 201);
    }
    if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) err('Файл не загружен');
    $file = $_FILES['file']; if ($file['size'] > MAX_FILE_SIZE) err('Файл слишком большой (макс. 20 МБ)');
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['pdf','doc','docx','xls','xlsx','jpg','jpeg','png'])) err('Недопустимый тип файла');
    $dir = UPLOAD_PATH.'/cert/'.$rid; if (!is_dir($dir)) mkdir($dir, 0755, true); $stored = uniqid('cf_').'.'.$ext;
    if (!move_uploaded_file($file['tmp_name'], $dir.'/'.$stored)) err('Ошибка сохранения файла');
    db()->prepare('INSERT INTO lk_cert_request_files(request_id,item_id,file_type,filename_original,filename_stored,uploader_id,uploader_role,created_at) VALUES(?,?,?,?,?,?,?,NOW())')->execute([$rid, $iid, 'file', $file['name'], $stored, $me['sub'], $me['role']]);
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager'; queue_notification('cert_request', $rid, $recipientRole, "Добавлен файл: {$file['name']}"); out(['id' => (int)db()->lastInsertId()], 201);
}

if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files' && isset($seg[5]) && ($seg[6] ?? '') === 'download') {
    $me = auth(); $rid = (int)$seg[1]; $iid = (int)$seg[3]; $fid = (int)$seg[5]; cert_request_guard($me, $rid);
    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?'); $stItem->execute([$iid]); $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) err('Позиция товара не найдена или не принадлежит заявке', 404);
    $st = db()->prepare('SELECT * FROM lk_cert_request_files WHERE id=? AND request_id=? AND item_id=?'); $st->execute([$fid, $rid, $iid]); $f = $st->fetch(); if (!$f || $f['file_type'] !== 'file') err('Не найдено', 404);
    $path = UPLOAD_PATH.'/cert/'.$rid.'/'.$f['filename_stored']; if (!file_exists($path)) err('Файл не найден', 404);
    send_file_download($path, $f['filename_original']);
}

if ($method === 'DELETE' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files' && isset($seg[5]) && !isset($seg[6])) {
    $me = auth(); $rid = (int)$seg[1]; $iid = (int)$seg[3]; $fid = (int)$seg[5]; cert_request_guard($me, $rid);
    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?'); $stItem->execute([$iid]); $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) err('Позиция товара не найдена или не принадлежит заявке', 404);
    $stFile = db()->prepare('SELECT * FROM lk_cert_request_files WHERE id=? AND request_id=? AND item_id=?'); $stFile->execute([$fid, $rid, $iid]); $file = $stFile->fetch(); if (!$file) err('Вложение не найдено', 404);
    if ($file['file_type'] === 'file' && !empty($file['filename_stored'])) { $path = UPLOAD_PATH.'/cert/'.$rid.'/'.$file['filename_stored']; if (file_exists($path)) @unlink($path); }
    db()->prepare('DELETE FROM lk_cert_request_files WHERE id=? AND request_id=? AND item_id=?')->execute([$fid, $rid, $iid]);
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager'; queue_notification('cert_request', $rid, $recipientRole, 'Удалено вложение'); out(['ok' => true]);
}

if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files' && !isset($seg[5])) {
    $me = auth(); $rid = (int)$seg[1]; $iid = (int)$seg[3]; cert_request_guard($me, $rid);
    $stItem = db()->prepare('SELECT id, request_id FROM lk_cert_request_items WHERE id=?'); $stItem->execute([$iid]); $item = $stItem->fetch();
    if (!$item || (int)$item['request_id'] !== $rid) err('Позиция товара не найдена или не принадлежит заявке', 404);
    $st = db()->prepare('SELECT * FROM lk_cert_request_files WHERE request_id=? AND item_id=? ORDER BY created_at DESC'); $st->execute([$rid, $iid]); out($st->fetchAll());
}

if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'messages' && !isset($seg[3])) {
    $me = auth(); $rid = (int)$seg[1]; cert_request_guard($me, $rid); $since = $_GET['since'] ?? '1970-01-01 00:00:00';
    $st = db()->prepare(
        'SELECT m.*, u.name AS sender_name,
         r.text AS reply_text, r.attachment_original AS reply_attachment_original,
         ru.name AS reply_sender_name
         FROM lk_cert_messages m
         JOIN lk_users u ON u.id=m.user_id
         LEFT JOIN lk_cert_messages r ON r.id=m.reply_to_id
         LEFT JOIN lk_users ru ON ru.id=r.user_id
         WHERE m.request_id=? AND m.created_at>?
         ORDER BY m.created_at ASC'
    );
    $st->execute([$rid, $since]);
    $other = $me['role'] === 'manager' ? 'cert_center' : 'manager';
    db()->prepare('UPDATE lk_cert_messages SET is_read=1 WHERE request_id=? AND role=? AND is_read=0')->execute([$rid, $other]);
    out($st->fetchAll());
}

// POST .../cert-requests/:id/messages (multipart/form-data: text + опционально file + опционально reply_to_id)
if ($method === 'POST' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'messages' && !isset($seg[3])) {
    $me = auth(); $rid = (int)$seg[1]; cert_request_guard($me, $rid);
    $text = trim((string)($_POST['text'] ?? ''));
    $attachedFile = handle_chat_attachment();
    if (!$text && !$attachedFile) err('Пустое сообщение');

    $replyToId = !empty($_POST['reply_to_id']) ? (int)$_POST['reply_to_id'] : null;
    if ($replyToId) {
        $chk = db()->prepare('SELECT id FROM lk_cert_messages WHERE id=? AND request_id=?');
        $chk->execute([$replyToId, $rid]);
        if (!$chk->fetch()) $replyToId = null;
    }

    $attachment = $attachedFile ? store_chat_attachment($attachedFile, 'chat/cert-requests/' . $rid) : null;

    db()->prepare('INSERT INTO lk_cert_messages(request_id,user_id,role,text,attachment_original,attachment_stored,attachment_size,reply_to_id,is_read,created_at) VALUES(?,?,?,?,?,?,?,?,0,NOW())')
        ->execute([
            $rid,
            $me['sub'],
            $me['role'],
            $text,
            $attachment['original'] ?? null,
            $attachment['stored'] ?? null,
            $attachment['size'] ?? null,
            $replyToId,
        ]);
    db()->prepare('UPDATE lk_cert_requests SET updated_at=NOW(), updated_by_role=? WHERE id=?')->execute([$me['role'], $rid]);
    $recipientRole = $me['role'] === 'manager' ? 'cert_center' : 'manager';
    $preview = $text !== '' ? mb_substr($text, 0, 80) : ('Файл: ' . ($attachment['original'] ?? ''));
    queue_notification('cert_request', $rid, $recipientRole, "Новое сообщение: «{$preview}»");
    out(['id' => (int)db()->lastInsertId()], 201);
}

// GET .../cert-requests/:id/messages/:msgId/download — скачивание вложения сообщения
if ($method === 'GET' && $seg[0] === 'cert-requests' && isset($seg[1]) && ($seg[2] ?? '') === 'messages' && isset($seg[3]) && ($seg[4] ?? '') === 'download') {
    $me = auth(); $rid = (int)$seg[1]; cert_request_guard($me, $rid);
    $mid = (int)$seg[3];
    $st = db()->prepare('SELECT * FROM lk_cert_messages WHERE id=? AND request_id=?');
    $st->execute([$mid, $rid]); $msg = $st->fetch();
    if (!$msg || empty($msg['attachment_stored'])) err('Файл не найден', 404);
    $path = UPLOAD_PATH . '/chat/cert-requests/' . $rid . '/' . $msg['attachment_stored'];
    if (!file_exists($path)) err('Файл не найден', 404);
    send_file_download($path, $msg['attachment_original']);
}

if ($method === 'GET' && $seg[0] === 'me' && ($seg[1] ?? '') === 'notifications') {
    $me = auth();
    $st = db()->prepare('SELECT email, notifications_enabled FROM lk_users WHERE id=?');
    $st->execute([$me['sub']]);
    $user = $st->fetch();
    if (!$user) err('Пользователь не найден', 404);
    out([
        'emails' => get_notification_emails((int)$me['sub'], (string)$user['email']),
        'enabled' => (bool)$user['notifications_enabled'],
    ]);
}

if ($method === 'PUT' && $seg[0] === 'me' && ($seg[1] ?? '') === 'notifications') {
    $me = auth();
    $b = body();
    $emails = normalize_email_list((array)($b['emails'] ?? []));
    $enabled = array_key_exists('enabled', $b) ? (int)!empty($b['enabled']) : null;

    db()->beginTransaction();
    try {
        db()->prepare('DELETE FROM lk_notification_emails WHERE user_id=?')->execute([$me['sub']]);
        if ($emails) {
            $ins = db()->prepare('INSERT INTO lk_notification_emails(user_id,email,created_at) VALUES(?,?,NOW())');
            foreach ($emails as $email) $ins->execute([$me['sub'], $email]);
        }
        if ($enabled !== null) {
            db()->prepare('UPDATE lk_users SET notifications_enabled=? WHERE id=?')->execute([$enabled, $me['sub']]);
        }
        db()->commit();
    } catch (\Throwable $e) {
        db()->rollBack(); err('Ошибка БД: ' . $e->getMessage());
    }
    out(['ok' => true]);
}

if ($method === 'GET' && $seg[0] === 'managers' && ($seg[1] ?? '') === 'cert-stats') {
    auth(true);
    out(['cert_centers_count' => (int) db()->query('SELECT COUNT(*) FROM lk_cert_centers WHERE is_active=1')->fetchColumn(), 'cert_requests_open' => (int) db()->query("SELECT COUNT(*) FROM lk_cert_requests WHERE status!='closed'")->fetchColumn()]);
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
    $rows = $st->fetchAll();
    foreach ($rows as &$row) {
        $row['number'] = document_number_label($row['document_number'] ?? null);
        $cntSt = db()->prepare('SELECT COUNT(*) FROM lk_shipment_cert_requests WHERE shipment_id=?');
        $cntSt->execute([$row['id']]);
        $row['cert_requests_count'] = (int)$cntSt->fetchColumn();
    }
    out($rows);
}

// POST /api/shipments
if ($method === 'POST' && $seg[0] === 'shipments' && !isset($seg[1])) {
    $me = auth();
    $b = body();

    if ($me['role'] === 'manager') {
        if (empty($b['client_id'])) {
            err('client_id обязателен для менеджера');
        }
        $clientId = (int)$b['client_id'];
    } elseif ($me['role'] === 'client') {
        if (empty($me['client_id'])) {
            err('У пользователя-клиента не задан client_id', 400);
        }
        $clientId = (int)$me['client_id'];
    } else {
        err('Недопустимая роль для создания поставки', 403);
    }

    $title = $b['title'] ?? 'Поставка';

    db()->beginTransaction();
    try {
        $st = db()->prepare(
            "INSERT INTO lk_shipments(client_id,title,status,created_at,updated_at,applicant_org,applicant_address,applicant_head,applicant_position,applicant_email,manufacturer_org,manufacturer_address,manufacturer_country)
             VALUES(?,?,'new',NOW(),NOW(),'','','','','','','','')"
        );
        $st->execute([$clientId, $title]);
        $shipmentId = (int)db()->lastInsertId();

        $docNumber = next_document_number('shipment', $shipmentId);
        db()->prepare('UPDATE lk_shipments SET document_number=? WHERE id=?')->execute([$docNumber, $shipmentId]);

        $stItem = db()->prepare(
            "INSERT INTO lk_shipment_items(shipment_id,position_no,product,tech_description,model_article,trademark,tn_ved,contract_invoice,quantity,price,tr_ts,cert_form,cert_price,comment,created_at,updated_at)
             VALUES(?,1,'','','','','','','','','','','','',NOW(),NOW())"
        );
        $stItem->execute([$shipmentId]);

        db()->commit();
    } catch (\Throwable $e) {
        db()->rollBack(); err('Ошибка БД: ' . $e->getMessage());
    }

    if ($me['role'] === 'client') {
        queue_notification('shipment', $shipmentId, 'manager', "Клиент создал поставку «{$title}»");
    } else {
        queue_notification('shipment', $shipmentId, 'client', "Менеджер создал для вас поставку «{$title}»");
    }

    out(['id' => $shipmentId], 201);
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
    $s['number'] = document_number_label($s['document_number'] ?? null);

    $linkedSt = db()->prepare(
        "SELECT r.id, r.document_number, r.status, r.updated_at, cc.name AS cert_center_name
         FROM lk_shipment_cert_requests sc
         JOIN lk_cert_requests r ON r.id = sc.cert_request_id
         JOIN lk_cert_centers cc ON cc.id = r.cert_center_id
         WHERE sc.shipment_id = ?
         ORDER BY r.created_at DESC"
    );
    $linkedSt->execute([$id]);
    $linked = $linkedSt->fetchAll();
    foreach ($linked as &$l) { $l['number'] = document_number_label($l['document_number'] ?? null); }
    $s['linked_cert_requests'] = $linked;

    out($s);
}

// GET /api/shipments/:id/items
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && !isset($seg[3])) {
    $me = auth(); $sid = (int)$seg[1]; shipment_guard($me, $sid);
    $st = db()->prepare('SELECT * FROM lk_shipment_items WHERE shipment_id=? ORDER BY position_no ASC, id ASC');
    $st->execute([$sid]);
    out($st->fetchAll());
}

// POST /api/shipments/:id/items — добавление позиции товара
if ($method === 'POST' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && !isset($seg[3])) {
    $me = auth();
    $sid = (int)$seg[1]; shipment_guard($me, $sid); $b = body();
    $st = db()->prepare('SELECT COALESCE(MAX(position_no),0)+1 FROM lk_shipment_items WHERE shipment_id=?');
    $st->execute([$sid]); $nextPos = (int)$st->fetchColumn();
    $allowed = ['product','tech_description','model_article','trademark','tn_ved','contract_invoice','quantity','price','tr_ts','cert_form','cert_price','comment'];
    $cols = ['shipment_id','position_no']; $vals = [$sid, $nextPos]; $marks = ['?','?'];
    foreach ($allowed as $f) { $cols[] = $f; $vals[] = $b[$f] ?? ''; $marks[] = '?'; }
    $sql = 'INSERT INTO lk_shipment_items(' . implode(',', $cols) . ',created_at,updated_at) VALUES(' . implode(',', $marks) . ',NOW(),NOW())';
    db()->prepare($sql)->execute($vals);
    $itemId = (int)db()->lastInsertId();
    db()->prepare('UPDATE lk_shipments SET updated_at=NOW() WHERE id=?')->execute([$sid]);
    $recipientRole = $me['role'] === 'manager' ? 'client' : 'manager';
    queue_notification('shipment', $sid, $recipientRole, 'Добавлена позиция №' . $nextPos);
    out(['id' => $itemId, 'position_no' => $nextPos], 201);
}

// POST /api/shipments/:id/sync-from-cert-request
// body: { cert_request_id }
if ($method === 'POST' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'sync-from-cert-request') {
    $me = auth(true);
    $sid = (int)$seg[1];
    shipment_guard($me, $sid);
    $b = body();

    if (empty($b['cert_request_id'])) err('cert_request_id обязателен');
    $requestId = (int)$b['cert_request_id'];

    $linkCheck = db()->prepare('SELECT id FROM lk_shipment_cert_requests WHERE shipment_id=? AND cert_request_id=?');
    $linkCheck->execute([$sid, $requestId]);
    if (!$linkCheck->fetch()) err('Эта заявка не привязана к поставке', 404);

    $st = db()->prepare('SELECT * FROM lk_cert_request_items WHERE request_id=? AND source_shipment_item_id IS NOT NULL');
    $st->execute([$requestId]);
    $certItems = $st->fetchAll();

    if (!$certItems) out(['ok' => true, 'synced' => 0]);

    $synced = 0;
    db()->beginTransaction();
    try {
        foreach ($certItems as $ci) {
            $shipItemCheck = db()->prepare('SELECT id FROM lk_shipment_items WHERE id=? AND shipment_id=?');
            $shipItemCheck->execute([$ci['source_shipment_item_id'], $sid]);
            if (!$shipItemCheck->fetch()) continue;

            db()->prepare(
                'UPDATE lk_shipment_items SET
                 product=?, tech_description=?, model_article=?, trademark=?, tn_ved=?,
                 contract_invoice=?, quantity=?, tr_ts=?, cert_form=?, updated_at=NOW()
                 WHERE id=?'
            )->execute([
                $ci['product'], $ci['tech_description'], $ci['model_article'], $ci['trademark'], $ci['tn_ved'],
                $ci['contract_invoice'], $ci['quantity'], $ci['tr_ts'], $ci['cert_form'],
                $ci['source_shipment_item_id'],
            ]);
            $synced++;
        }
        db()->prepare('UPDATE lk_shipments SET updated_at=NOW() WHERE id=?')->execute([$sid]);
        db()->commit();
    } catch (\Throwable $e) {
        db()->rollBack(); err('Ошибка БД: ' . $e->getMessage());
    }

    out(['ok' => true, 'synced' => $synced]);
}

// PUT /api/shipments/:id/items/:itemId — обновить позицию
if ($method === 'PUT' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3])) {
    $me = auth(); // было: auth(true)
    $sid = (int)$seg[1]; $iid = (int)$seg[3]; shipment_guard($me, $sid);
    $chk = db()->prepare('SELECT id FROM lk_shipment_items WHERE id=? AND shipment_id=?'); $chk->execute([$iid, $sid]);
    if (!$chk->fetch()) err('Позиция не найдена', 404);
    $b = body();
    $allowed = ['product','tech_description','model_article','trademark','tn_ved','contract_invoice','quantity','price','tr_ts','cert_form','cert_price','comment'];
    $set = []; $vals = [];
    foreach ($allowed as $f) if (array_key_exists($f, $b)) { $set[] = "$f=?"; $vals[] = $b[$f]; }
    if (!$set) err('Нет данных для обновления');
    $vals[] = $iid;
    db()->prepare('UPDATE lk_shipment_items SET ' . implode(',', $set) . ', updated_at=NOW() WHERE id=?')->execute($vals);
    db()->prepare('UPDATE lk_shipments SET updated_at=NOW() WHERE id=?')->execute([$sid]);
    $recipientRole = $me['role'] === 'manager' ? 'client' : 'manager';
    queue_notification('shipment', $sid, $recipientRole, 'Изменена позиция поставки');
    out(['ok' => true]);
}

// DELETE /api/shipments/:id/items/:itemId — удалить позицию (запрещено, если последняя)
if ($method === 'DELETE' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3])) {
    $me = auth(); // было: auth(true)
    $sid = (int)$seg[1]; $iid = (int)$seg[3]; shipment_guard($me, $sid);
    $cnt = (int) db()->query("SELECT COUNT(*) FROM lk_shipment_items WHERE shipment_id=$sid")->fetchColumn();
    if ($cnt <= 1) err('В поставке должна остаться хотя бы одна позиция товара');
    db()->prepare('DELETE FROM lk_shipment_items WHERE id=? AND shipment_id=?')->execute([$iid, $sid]);
    db()->prepare('UPDATE lk_shipments SET updated_at=NOW() WHERE id=?')->execute([$sid]);
    $recipientRole = $me['role'] === 'manager' ? 'client' : 'manager';
    queue_notification('shipment', $sid, $recipientRole, 'Удалена позиция поставки');
    out(['ok' => true]);
}

// POST /api/shipments/:id/items/:itemId/files — загрузка файла или добавление ссылки
if ($method === 'POST' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files') {
    $me = auth(); $sid = (int)$seg[1]; $iid = (int)$seg[3]; shipment_guard($me, $sid);
    $stItem = db()->prepare('SELECT id, shipment_id FROM lk_shipment_items WHERE id=?'); $stItem->execute([$iid]); $item = $stItem->fetch();
    if (!$item || (int)$item['shipment_id'] !== $sid) err('Позиция товара не найдена или не принадлежит поставке', 404);

    if (!empty($_POST['url'])) {
        db()->prepare('INSERT INTO lk_shipment_item_files(shipment_id,item_id,file_type,url,uploader_id,uploader_role,created_at) VALUES(?,?,?,?,?,?,NOW())')
            ->execute([$sid, $iid, 'link', $_POST['url'], $me['sub'], $me['role']]);
        db()->prepare('UPDATE lk_shipments SET updated_at=NOW() WHERE id=?')->execute([$sid]);
        $recipientRole = $me['role'] === 'manager' ? 'client' : 'manager';
        queue_notification('shipment', $sid, $recipientRole, 'Добавлена ссылка на вложение позиции');
        out(['ok' => true], 201);
    }

    if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) err('Файл не загружен');
    $file = $_FILES['file']; if ($file['size'] > MAX_FILE_SIZE) err('Файл слишком большой (макс. 20 МБ)');
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['pdf','doc','docx','xls','xlsx','jpg','jpeg','png'])) err('Недопустимый тип файла');
    $dir = UPLOAD_PATH . '/shipment-items/' . $sid; if (!is_dir($dir)) mkdir($dir, 0755, true);
    $stored = uniqid('sf_') . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $stored)) err('Ошибка сохранения файла');
    db()->prepare('INSERT INTO lk_shipment_item_files(shipment_id,item_id,file_type,filename_original,filename_stored,uploader_id,uploader_role,created_at) VALUES(?,?,?,?,?,?,?,NOW())')
        ->execute([$sid, $iid, 'file', $file['name'], $stored, $me['sub'], $me['role']]);
    db()->prepare('UPDATE lk_shipments SET updated_at=NOW() WHERE id=?')->execute([$sid]);
    $recipientRole = $me['role'] === 'manager' ? 'client' : 'manager';
    queue_notification('shipment', $sid, $recipientRole, "Добавлен файл к позиции: {$file['name']}");
    out(['id' => (int)db()->lastInsertId()], 201);
}

// GET /api/shipments/:id/items/:itemId/files — список вложений
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files' && !isset($seg[5])) {
    $me = auth(); $sid = (int)$seg[1]; $iid = (int)$seg[3]; shipment_guard($me, $sid);
    $stItem = db()->prepare('SELECT id, shipment_id FROM lk_shipment_items WHERE id=?'); $stItem->execute([$iid]); $item = $stItem->fetch();
    if (!$item || (int)$item['shipment_id'] !== $sid) err('Позиция товара не найдена или не принадлежит поставке', 404);
    $st = db()->prepare('SELECT * FROM lk_shipment_item_files WHERE shipment_id=? AND item_id=? ORDER BY created_at DESC');
    $st->execute([$sid, $iid]); out($st->fetchAll());
}

// GET /api/shipments/:id/items/:itemId/files/:fileId/download
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files' && isset($seg[5]) && ($seg[6] ?? '') === 'download') {
    $me = auth(); $sid = (int)$seg[1]; $iid = (int)$seg[3]; $fid = (int)$seg[5]; shipment_guard($me, $sid);
    $st = db()->prepare('SELECT * FROM lk_shipment_item_files WHERE id=? AND shipment_id=? AND item_id=?');
    $st->execute([$fid, $sid, $iid]); $f = $st->fetch();
    if (!$f || $f['file_type'] !== 'file') err('Не найдено', 404);
    $path = UPLOAD_PATH . '/shipment-items/' . $sid . '/' . $f['filename_stored'];
    if (!file_exists($path)) err('Файл не найден', 404);
    send_file_download($path, $f['filename_original']);
}

// GET /api/shipments/:id/items/check-usage?item_ids=1,2,3
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && ($seg[3] ?? '') === 'check-usage') {
    $me = auth(true); $sid = (int)$seg[1]; shipment_guard($me, $sid);
    $itemIds = array_filter(array_map('intval', explode(',', (string)($_GET['item_ids'] ?? ''))));
    if (!$itemIds) out(['used' => []]);
    $placeholders = implode(',', array_fill(0, count($itemIds), '?'));
    $sql = "SELECT ci.source_shipment_item_id, r.id AS cert_request_id, r.document_number, cc.name AS cert_center_name, r.status
            FROM lk_cert_request_items ci
            JOIN lk_cert_requests r ON r.id = ci.request_id
            JOIN lk_cert_centers cc ON cc.id = r.cert_center_id
            WHERE ci.source_shipment_item_id IN ($placeholders)
            AND r.status NOT IN ('closed','rejected')";
    $st = db()->prepare($sql); $st->execute($itemIds);
    out(['used' => $st->fetchAll()]);
}

// POST /api/shipments/:id/generate-cert-request
// body: { cert_center_id, item_ids: [1,2,3] }
if ($method === 'POST' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'generate-cert-request') {
    $me = auth(true);
    $sid = (int)$seg[1];
    $shipment = shipment_guard($me, $sid);
    $b = body();

    if (empty($b['cert_center_id'])) err('cert_center_id обязателен');
    $certCenterId = (int)$b['cert_center_id'];
    $itemIds = array_filter(array_map('intval', (array)($b['item_ids'] ?? [])));
    if (!$itemIds) err('Не выбраны товары для формирования заявки', 422);

    $cc = db()->prepare('SELECT id FROM lk_cert_centers WHERE id=? AND is_active=1 LIMIT 1'); $cc->execute([$certCenterId]);
    if (!$cc->fetch()) err('Сертификационный центр не найден', 404);

    $placeholders = implode(',', array_fill(0, count($itemIds), '?'));
    $params = array_merge([$sid], $itemIds);
    $st = db()->prepare("SELECT * FROM lk_shipment_items WHERE shipment_id=? AND id IN ($placeholders) ORDER BY position_no ASC, id ASC");
    $st->execute($params);
    $items = $st->fetchAll();
    if (!$items) err('Не найдены выбранные товары', 404);

    db()->beginTransaction();
    try {
        $company = (string)($shipment['applicant_org'] ?? '');
        $stReq = db()->prepare(
            "INSERT INTO lk_cert_requests(cert_center_id,status,created_by,created_at,updated_at,updated_by_role,manager_seen_at,center_seen_at,applicant_org,applicant_address,applicant_head,applicant_position,applicant_email,manufacturer_org,manufacturer_address,manufacturer_country)
             VALUES (?, 'open', ?, NOW(), NOW(), 'manager', NOW(), NULL, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stReq->execute([
            $certCenterId, (int)$me['sub'],
            $shipment['applicant_org'], $shipment['applicant_address'], $shipment['applicant_head'], $shipment['applicant_position'], $shipment['applicant_email'],
            $shipment['manufacturer_org'], $shipment['manufacturer_address'], $shipment['manufacturer_country'],
        ]);
        $requestId = (int)db()->lastInsertId();

        db()->prepare('UPDATE lk_cert_requests SET document_number=? WHERE id=?')->execute([$shipment['document_number'], $requestId]);
        db()->prepare('INSERT INTO lk_shipment_cert_requests(shipment_id,cert_request_id,created_at) VALUES(?,?,NOW())')
            ->execute([$sid, $requestId]);

        $posNo = 1;
        foreach ($items as $item) {
            $stItem = db()->prepare(
                "INSERT INTO lk_cert_request_items(request_id,position_no,is_checked,company,product,tn_ved,tech_description,model_article,trademark,contract_invoice,quantity,tr_ts,cert_form,cert_scheme,cost,production_deadline,samples_required,samples_city,comment,source_shipment_item_id,created_at,updated_at)
                 VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', ?, NOW(), NOW())"
            );
            $stItem->execute([
                $requestId, $posNo, $company,
                $item['product'], $item['tn_ved'], $item['tech_description'], $item['model_article'], $item['trademark'],
                $item['contract_invoice'], $item['quantity'], $item['tr_ts'], $item['cert_form'],
                (int)$item['id'],
            ]);
            $newItemId = (int)db()->lastInsertId();

            $filesSt = db()->prepare('SELECT * FROM lk_shipment_item_files WHERE shipment_id=? AND item_id=?');
            $filesSt->execute([$sid, $item['id']]);
            foreach ($filesSt->fetchAll() as $f) {
                if ($f['file_type'] === 'link') {
                    db()->prepare('INSERT INTO lk_cert_request_files(request_id,item_id,file_type,url,uploader_id,uploader_role,created_at) VALUES(?,?,?,?,?,?,NOW())')
                        ->execute([$requestId, $newItemId, 'link', $f['url'], $f['uploader_id'], $f['uploader_role']]);
                } else {
                    $srcPath = UPLOAD_PATH . '/shipment-items/' . $sid . '/' . $f['filename_stored'];
                    if (file_exists($srcPath)) {
                        $ext = strtolower(pathinfo($f['filename_stored'], PATHINFO_EXTENSION));
                        $newStored = uniqid('cf_') . '.' . $ext;
                        $destDir = UPLOAD_PATH . '/cert/' . $requestId;
                        if (!is_dir($destDir)) mkdir($destDir, 0755, true);
                        copy($srcPath, $destDir . '/' . $newStored);
                        db()->prepare('INSERT INTO lk_cert_request_files(request_id,item_id,file_type,filename_original,filename_stored,uploader_id,uploader_role,created_at) VALUES(?,?,?,?,?,?,?,NOW())')
                            ->execute([$requestId, $newItemId, 'file', $f['filename_original'], $newStored, $f['uploader_id'], $f['uploader_role']]);
                    }
                }
            }
            $posNo++;
        }

        db()->commit();
    } catch (\Throwable $e) {
        db()->rollBack(); err('Ошибка БД: ' . $e->getMessage());
    }

    out(['id' => $requestId], 201);
}

// DELETE /api/shipments/:id/items/:itemId/files/:fileId
if ($method === 'DELETE' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'items' && isset($seg[3]) && ($seg[4] ?? '') === 'files' && isset($seg[5]) && !isset($seg[6])) {
    $me = auth(); $sid = (int)$seg[1]; $iid = (int)$seg[3]; $fid = (int)$seg[5]; shipment_guard($me, $sid);
    $stFile = db()->prepare('SELECT * FROM lk_shipment_item_files WHERE id=? AND shipment_id=? AND item_id=?');
    $stFile->execute([$fid, $sid, $iid]); $file = $stFile->fetch();
    if (!$file) err('Вложение не найдено', 404);
    if ($file['file_type'] === 'file' && !empty($file['filename_stored'])) {
        $path = UPLOAD_PATH . '/shipment-items/' . $sid . '/' . $file['filename_stored'];
        if (file_exists($path)) @unlink($path);
    }
    db()->prepare('DELETE FROM lk_shipment_item_files WHERE id=? AND shipment_id=? AND item_id=?')->execute([$fid, $sid, $iid]);
    db()->prepare('UPDATE lk_shipments SET updated_at=NOW() WHERE id=?')->execute([$sid]);
    $recipientRole = $me['role'] === 'manager' ? 'client' : 'manager';
    queue_notification('shipment', $sid, $recipientRole, 'Удалён файл позиции поставки');
    out(['ok' => true]);
}

// PUT /api/shipments/:id
if ($method === 'PUT' && $seg[0] === 'shipments' && isset($seg[1]) && !isset($seg[2])) {
    $me = auth(true);
    $b = body();
    $sid = (int)$seg[1];
    $valid = ['new','documents_requested','documents_received','declaration_filed','customs_inspection','released','on_hold'];
    if (!in_array($b['status'] ?? '', $valid)) err('Недопустимый статус');
    db()->prepare('UPDATE lk_shipments SET status=?, updated_at=NOW() WHERE id=?')
        ->execute([$b['status'], $sid]);
    $statusLabels = [
        'new' => 'Новая',
        'documents_requested' => 'Запрос документов',
        'documents_received' => 'Документы получены',
        'declaration_filed' => 'Декларация подана',
        'customs_inspection' => 'Таможенный контроль',
        'released' => 'Выпущен',
        'on_hold' => 'Задержан',
    ];
    $recipientRole = $me['role'] === 'manager' ? 'client' : 'manager';
    queue_notification('shipment', $sid, $recipientRole, 'Статус поставки: ' . ($statusLabels[$b['status']] ?? $b['status']));
    out(['ok' => true]);
}

// PUT /api/shipments/:id/info — обновление данных заявителя/изготовителя (только менеджер)
if ($method === 'PUT' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'info') {
    $me = auth();
    $sid = (int)$seg[1];
    shipment_guard($me, $sid);
    $b = body();

    $fields = ['applicant_org','applicant_address','applicant_head','applicant_position','applicant_email','manufacturer_org','manufacturer_address','manufacturer_country'];
    $set = []; $vals = [];
    foreach ($fields as $f) {
        if (array_key_exists($f, $b)) { $set[] = "$f=?"; $vals[] = (string)$b[$f]; }
    }
    if (!$set) err('Нет данных для обновления');
    $vals[] = $sid;
    db()->prepare('UPDATE lk_shipments SET ' . implode(',', $set) . ', updated_at=NOW() WHERE id=?')->execute($vals);
    $recipientRole = $me['role'] === 'manager' ? 'client' : 'manager';
    queue_notification('shipment', $sid, $recipientRole, 'Обновлены реквизиты поставки');
    out(['ok' => true]);
}

// DELETE /api/shipments/:id
if ($method === 'DELETE' && $seg[0] === 'shipments' && isset($seg[1]) && !isset($seg[2])) {
    auth(true);

    $id = (int)$seg[1];

    $st = db()->prepare('SELECT id FROM lk_shipments WHERE id=?');
    $st->execute([$id]);
    $shipment = $st->fetch();
    if (!$shipment) {
        err('Поставка не найдена', 404);
    }

    db()->prepare('DELETE FROM lk_shipments WHERE id=?')->execute([$id]);

    out(['ok' => true]);
}

// GET /api/shipments/:id/documents
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'documents' && !isset($seg[3])) {
    $me = auth();
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
    $me = auth();
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
    $vis = $me['role'] === 'manager' ? (int)($_POST['visible_to_client'] ?? 0) : 1;
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
    $recipientRole = $me['role'] === 'manager' ? 'client' : 'manager';
    queue_notification('shipment', $sid, $recipientRole, 'Загружен документ: ' . $file['name']);
    out(['id' => (int)db()->lastInsertId()], 201);
}

// GET /api/shipments/:id/documents/:docId/download
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'documents' && isset($seg[3]) && ($seg[4] ?? '') === 'download') {
    $me = auth();
    $sid = (int)$seg[1];
    $did = (int)$seg[3];
    $st = db()->prepare('SELECT * FROM lk_documents WHERE id=? AND shipment_id=?');
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
    $st = db()->prepare('SELECT * FROM lk_documents WHERE id=? AND shipment_id=?');
    $st->execute([$did, $sid]); $doc = $st->fetch(); if (!$doc) err('Не найдено', 404);
    $path = UPLOAD_PATH.'/'.$sid.'/'.$doc['filename_stored'];
    if (file_exists($path)) unlink($path);
    db()->prepare('DELETE FROM lk_documents WHERE id=?')->execute([$did]);
    out(['ok' => true]);
}

// GET /api/shipments/:id/messages
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'messages' && !isset($seg[3])) {
    $me = auth();
    $sid = (int)$seg[1];
    if ($me['role'] === 'client') {
        $c = db()->prepare('SELECT client_id FROM lk_shipments WHERE id=?'); $c->execute([$sid]);
        $s = $c->fetch(); if (!$s || $s['client_id'] != $me['client_id']) err('Нет доступа', 403);
    }
    $since = $_GET['since'] ?? '1970-01-01 00:00:00';
    $st = db()->prepare(
        'SELECT m.*, u.name AS sender_name,
         r.text AS reply_text, r.attachment_original AS reply_attachment_original,
         ru.name AS reply_sender_name
         FROM lk_messages m
         JOIN lk_users u ON u.id=m.user_id
         LEFT JOIN lk_messages r ON r.id=m.reply_to_id
         LEFT JOIN lk_users ru ON ru.id=r.user_id
         WHERE m.shipment_id=? AND m.created_at>?
         ORDER BY m.created_at ASC'
    );
    $st->execute([$sid, $since]);
    $other = $me['role'] === 'manager' ? 'client' : 'manager';
    db()->prepare("UPDATE lk_messages SET is_read=1 WHERE shipment_id=? AND role=? AND is_read=0")
        ->execute([$sid, $other]);
    out($st->fetchAll());
}

// POST /api/shipments/:id/messages (multipart/form-data: text + опционально file + опционально reply_to_id)
if ($method === 'POST' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'messages' && !isset($seg[3])) {
    $me = auth();
    $sid = (int)$seg[1];
    if ($me['role'] === 'client') {
        $c = db()->prepare('SELECT client_id FROM lk_shipments WHERE id=?'); $c->execute([$sid]);
        $s = $c->fetch(); if (!$s || $s['client_id'] != $me['client_id']) err('Нет доступа', 403);
    }
    $text = trim((string)($_POST['text'] ?? ''));
    $attachedFile = handle_chat_attachment();
    if (!$text && !$attachedFile) err('Пустое сообщение');

    $replyToId = !empty($_POST['reply_to_id']) ? (int)$_POST['reply_to_id'] : null;
    if ($replyToId) {
        $chk = db()->prepare('SELECT id FROM lk_messages WHERE id=? AND shipment_id=?');
        $chk->execute([$replyToId, $sid]);
        if (!$chk->fetch()) $replyToId = null;
    }

    $attachment = $attachedFile ? store_chat_attachment($attachedFile, 'chat/shipments/' . $sid) : null;

    $st = db()->prepare(
        'INSERT INTO lk_messages(shipment_id,user_id,role,text,attachment_original,attachment_stored,attachment_size,reply_to_id,is_read,created_at)
         VALUES(?,?,?,?,?,?,?,?,0,NOW())'
    );
    $st->execute([
        $sid,
        $me['sub'],
        $me['role'],
        $text,
        $attachment['original'] ?? null,
        $attachment['stored'] ?? null,
        $attachment['size'] ?? null,
        $replyToId,
    ]);
    $recipientRole = $me['role'] === 'manager' ? 'client' : 'manager';
    $preview = $text !== '' ? mb_substr($text, 0, 80) : ('Файл: ' . ($attachment['original'] ?? ''));
    queue_notification('shipment', $sid, $recipientRole, "Новое сообщение: «{$preview}»");
    out(['id' => (int)db()->lastInsertId()], 201);
}

// GET /api/shipments/:id/messages/:msgId/download — скачивание вложения сообщения
if ($method === 'GET' && $seg[0] === 'shipments' && isset($seg[1]) && ($seg[2] ?? '') === 'messages' && isset($seg[3]) && ($seg[4] ?? '') === 'download') {
    $me = auth();
    $sid = (int)$seg[1];
    $mid = (int)$seg[3];
    if ($me['role'] === 'client') {
        $c = db()->prepare('SELECT client_id FROM lk_shipments WHERE id=?'); $c->execute([$sid]);
        $s = $c->fetch(); if (!$s || $s['client_id'] != $me['client_id']) err('Нет доступа', 403);
    }
    $st = db()->prepare('SELECT * FROM lk_messages WHERE id=? AND shipment_id=?');
    $st->execute([$mid, $sid]); $msg = $st->fetch();
    if (!$msg || empty($msg['attachment_stored'])) err('Файл не найден', 404);
    $path = UPLOAD_PATH . '/chat/shipments/' . $sid . '/' . $msg['attachment_stored'];
    if (!file_exists($path)) err('Файл не найден', 404);
    send_file_download($path, $msg['attachment_original']);
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

// GET /api/templates/:key/download — статические шаблоны документов (ДУЛ, заявка и т.д.)
if ($method === 'GET' && $seg[0] === 'templates' && isset($seg[1]) && ($seg[2] ?? '') === 'download') {
    auth(); // доступно менеджеру и сертцентру (и клиенту — при необходимости)

    $templates = [
        'dul' => ['file' => 'dul-template.docx', 'name' => 'Шаблон ДУЛ.docx'],
        'request' => ['file' => 'request-template.docx', 'name' => 'Шаблон заявки.docx'],
    ];

    $key = (string)$seg[1];
    if (!isset($templates[$key])) err('Шаблон не найден', 404);

    $path = __DIR__ . '/templates/' . $templates[$key]['file'];
    if (!is_file($path) || !is_readable($path)) err('Файл шаблона отсутствует на сервере', 404);

    send_file_download(
        $path,
        $templates[$key]['name'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
}

err('Маршрут не найден', 404);
