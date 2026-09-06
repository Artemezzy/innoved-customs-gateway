<?php
declare(strict_types=1);

// GET /api/cert-requests
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

        $linkedShipSt = db()->prepare(
            'SELECT s.id, s.document_number
             FROM lk_shipment_cert_requests sc
             JOIN lk_shipments s ON s.id = sc.shipment_id
             WHERE sc.cert_request_id=?
             ORDER BY sc.id ASC
             LIMIT 1'
        );
        $linkedShipSt->execute([$row['id']]);
        $ls = $linkedShipSt->fetch();
        $row['linked_shipment'] = $ls
            ? ['id' => (int)$ls['id'], 'number' => document_number_label($ls['document_number'] ?? null)]
            : null;
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
        $item['is_checked'] = (bool)$item['is_checked']; $item['is_confirmed'] = (bool)$item['is_confirmed'];
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
    foreach ($items as &$item) $item['is_checked'] = (bool)$item['is_checked']; $item['is_confirmed'] = (bool)$item['is_confirmed'];
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