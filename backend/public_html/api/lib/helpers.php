<?php
declare(strict_types=1);

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

/** Сопоставление слота файла и статуса, который он подтверждает (см. docs/PROJECT_CONTEXT.md). */

const CONFIRMED_ITEM_SLOT_STATUS_MAP = [
    'agreed_application' => 'app_agreed',
    'agreed_id_doc' => 'id_doc_provided',
    'agreed_layout' => 'layout_agreed',
    'payment_invoice' => 'cc_paid',
    'cc_contract' => 'cc_contract_signed',
    'import_letter' => 'import_letter_provided',
    'samples_dt' => 'samples_dt_provided',
    'final_document' => 'final_doc_received',
];

const CONFIRMED_ITEM_ALLOWED_SLOTS = [
    'agreed_application', 'agreed_id_doc', 'agreed_layout', 'payment_invoice',
    'cc_contract', 'import_letter', 'samples_dt', 'final_document',
];

const CONFIRMED_ITEM_ALLOWED_STATUSES = [
    'confirmed', 'app_agreed', 'id_doc_provided', 'layout_agreed', 'cc_paid',
    'cc_contract_signed', 'import_letter_provided', 'samples_dt_provided',
    'final_doc_received', 'rejected',
];

/**
 * Guard доступа к подтверждённой позиции.
 *
 * manager: полный доступ ко всем.
 * cert_center: доступ только если позиция принадлежит заявке,
 *   назначенной на этот серт-центр (через lk_confirmed_items.source_request_id
 *   -> lk_cert_requests.cert_center_id).
 * client: только чтение, только если confirmed_items.client_id совпадает
 *   с client_id из JWT (проверяется отдельно в самих обработчиках GET-списка,
 *   этот guard используется для мутирующих действий, где client всегда 403).
 */

function confirmed_item_guard(array $me, int $id): array {
    $st = db()->prepare(
        'SELECT ci.*, r.cert_center_id AS request_cert_center_id
         FROM lk_confirmed_items ci
         JOIN lk_cert_requests r ON r.id = ci.source_request_id
         WHERE ci.id=?'
    );
    $st->execute([$id]);
    $row = $st->fetch();
    if (!$row) err('Подтверждённая позиция не найдена', 404);

    if ($me['role'] === 'cert_center' && (int)$row['request_cert_center_id'] !== (int)($me['cert_center_id'] ?? 0)) {
        err('Нет доступа', 403);
    }
    if ($me['role'] === 'client' && (int)($row['client_id'] ?? 0) !== (int)($me['client_id'] ?? 0)) {
        err('Нет доступа', 403);
    }
    if (!in_array($me['role'], ['manager', 'cert_center', 'client'], true)) {
        err('Нет доступа', 403);
    }
    return $row;
}

/** Человекочитаемые лейблы статусов подтверждённой позиции (для очереди уведомлений/логов). */

function confirmed_item_status_label(string $status): string {
    $labels = [
        'confirmed' => 'Подтверждено',
        'app_agreed' => 'Заявка согласована',
        'id_doc_provided' => 'ДУЛ предоставлен',
        'layout_agreed' => 'Макет согласован',
        'cc_paid' => 'Проведена оплата в СЦ',
        'cc_contract_signed' => 'Подписан договор с СЦ',
        'import_letter_provided' => 'Предоставлено письмо на ввоз',
        'samples_dt_provided' => 'ДТ образцов предоставлен',
        'final_doc_received' => 'Финальный документ получен',
        'rejected' => 'Отклонено',
    ];
    return $labels[$status] ?? $status;
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
    $templatePath = dirname(__DIR__) . '/templates/cert-request-template.docx';

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