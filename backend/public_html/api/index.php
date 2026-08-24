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

    $contentTypes = '<?xml version"1.0" encoding="UTF-8" standalone="yes"?>'
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

// ... (rest of file unchanged)
