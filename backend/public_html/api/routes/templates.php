<?php
declare(strict_types=1);

// GET /api/templates/:key/download — статические шаблоны документов (ДУЛ, заявка и т.д.)
if ($method === 'GET' && $seg[0] === 'templates' && isset($seg[1]) && ($seg[2] ?? '') === 'download') {
    auth(); // доступно менеджеру и сертцентру (и клиенту — при необходимости)

    $templates = [
        'dul' => ['file' => 'dul-template.docx', 'name' => 'Шаблон ДУЛ.docx'],
        'request' => ['file' => 'request-template.docx', 'name' => 'Шаблон заявки.docx'],
    ];

    $key = (string)$seg[1];
    if (!isset($templates[$key])) err('Шаблон не найден', 404);

    $path = dirname(__DIR__) . '/templates/' . $templates[$key]['file'];
    if (!is_file($path) || !is_readable($path)) err('Файл шаблона отсутствует на сервере', 404);

    send_file_download(
        $path,
        $templates[$key]['name'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
}