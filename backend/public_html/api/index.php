<?php
declare(strict_types=1);
error_reporting(0);
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib/helpers.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . FRONTEND_ORIGIN);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim(preg_replace('#^/api#', '', $uri), '/');
$seg = explode('/', $path);

require __DIR__ . '/routes/organization_profiles.php';
require __DIR__ . '/routes/auth.php';
require __DIR__ . '/routes/managers.php';
require __DIR__ . '/routes/clients.php';
require __DIR__ . '/routes/cert_requests.php';
require __DIR__ . '/routes/shipments.php';
require __DIR__ . '/routes/cert_centers.php';
require __DIR__ . '/routes/templates.php';

err('Маршрут не найден', 404);