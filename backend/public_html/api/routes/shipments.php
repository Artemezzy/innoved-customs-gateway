<?php
declare(strict_types=1);

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
        $certSt = db()->prepare(
            'SELECT r.id, r.document_number
             FROM lk_shipment_cert_requests sc
             JOIN lk_cert_requests r ON r.id = sc.cert_request_id
             WHERE sc.shipment_id=?
             ORDER BY sc.id ASC'
        );
        $certSt->execute([$row['id']]);
        $certRows = $certSt->fetchAll();
        $row['cert_requests_count'] = count($certRows);
        $row['linked_cert_requests_brief'] = array_map(
            static fn($c) => ['id' => (int)$c['id'], 'number' => document_number_label($c['document_number'] ?? null)],
            $certRows
        );
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