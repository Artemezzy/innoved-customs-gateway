<?php
/**
 * ОБНОВЛЕНО: backend/public_html/api/routes/confirmed_items.php
 *
 * Изменения относительно предыдущей версии:
 * 1. lk_confirmed_items теперь имеет собственное поле cert_center_id
 *    (см. migration_confirmed_items_cert_center_v2.sql). Видимость для
 *    роли cert_center определяется этим полем, а не cert_center_id
 *    заявки-источника — это позволяет менеджеру переназначить СЦ для
 *    конкретной подтверждённой позиции независимо от исходной заявки.
 * 2. confirmed_item_guard() обновлён: JOIN на lk_cert_requests больше не
 *    нужен для проверки владения СЦ — сравнение идёт напрямую по
 *    ci.cert_center_id. JOIN оставлен только для получения
 *    source_document_number в других местах, где это требуется.
 * 3. GET /confirmed-items: для ролей cert_center и client поля
 *    cert_center_id / cert_center_name не включаются в ответ вообще
 *    (не только скрываются в UI) — согласно требованию, что эти роли
 *    не должны видеть назначенный СЦ.
 * 4. PUT /confirmed-items/:id: добавлено поле cert_center_id в allowed,
 *    редактируется только менеджером (как applicant_profile_id/client_id).
 * 5. POST /cert-requests/:id/items/:itemId/confirm: cert_center_id
 *    копируется из заявки-источника при переносе (разовое копирование).
 *
 * ВАЖНО: этот файл заменяет routes/confirmed_items.php целиком.
 * confirmed_item_guard() в lib/helpers.php тоже нужно обновить —
 * см. helpers_patch_confirmed_items_v2.php.
 */

declare(strict_types=1);

/**
 * GET /confirmed-items
 *
 * manager: все подтверждённые позиции, включая cert_center_id/cert_center_name.
 * cert_center: только позиции, где ci.cert_center_id совпадает с назначенным СЦ;
 *   поля cert_center_id/cert_center_name не возвращаются в ответе.
 * client: только позиции, где client_id совпадает с client_id из JWT;
 *   поля cert_center_id/cert_center_name не возвращаются в ответе.
 */
if ($method === 'GET' && $seg[0] === 'confirmed-items' && !isset($seg[1])) {
    $me = auth();

    $sql = "SELECT ci.*,
                   r.document_number AS source_document_number,
                   op.name AS applicant_name,
                   c.name AS client_name,
                   cc.name AS cert_center_name
            FROM lk_confirmed_items ci
            JOIN lk_cert_requests r ON r.id = ci.source_request_id
            JOIN lk_cert_centers cc ON cc.id = ci.cert_center_id
            LEFT JOIN lk_organization_profiles op ON op.id = ci.applicant_profile_id
            LEFT JOIN lk_clients c ON c.id = ci.client_id
            WHERE 1=1";
    $p = [];

    if ($me['role'] === 'cert_center') {
        $sql .= ' AND ci.cert_center_id=?';
        $p[] = $me['cert_center_id'];
    } elseif ($me['role'] === 'client') {
        $sql .= ' AND ci.client_id=?';
        $p[] = $me['client_id'];
    } elseif ($me['role'] !== 'manager') {
        err('Нет доступа', 403);
    }

    $sql .= ' ORDER BY ci.created_at DESC';
    $st = db()->prepare($sql);
    $st->execute($p);
    $rows = $st->fetchAll();

    $isManager = $me['role'] === 'manager';

    foreach ($rows as &$row) {
        $row['number'] = document_number_label((int)$row['source_document_number']) . '-' . (int)$row['suffix_no'];
        $row['source_number'] = document_number_label((int)$row['source_document_number']);

        $row['buyer_invoice_paid'] = (bool)$row['buyer_invoice_paid'];
        $row['innoved_invoice_paid'] = (bool)$row['innoved_invoice_paid'];

        if (!$isManager) {
            unset($row['cert_center_id'], $row['cert_center_name']);
        }

        if ($isClient) {
            unset($row['buyer_invoice_paid'], $row['innoved_invoice_paid']);
        }

        $filesSt = db()->prepare(
            'SELECT slot, id, filename_original, allow_center_reupload, created_at
             FROM lk_confirmed_item_files
             WHERE confirmed_item_id=? AND is_current=1
             ORDER BY slot ASC'
        );
        $filesSt->execute([$row['id']]);
        $row['files'] = $filesSt->fetchAll();
    }
    unset($row);

    out($rows);
}

/**
 * POST /cert-requests/:id/items/:itemId/confirm
 *
 * Перенос позиции заявки на сертификацию в «Подтверждённые заявки».
 * Доступно только менеджеру. cert_center_id копируется из заявки-источника
 * разово в момент переноса (дальше редактируется независимо через PUT).
 */
if (
    $method === 'POST'
    && $seg[0] === 'cert-requests'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'items'
    && isset($seg[3])
    && ($seg[4] ?? '') === 'confirm'
) {
    $me = auth(true);
    $rid = (int)$seg[1];
    $iid = (int)$seg[3];
    $request = cert_request_guard($me, $rid);

    $st = db()->prepare('SELECT * FROM lk_cert_request_items WHERE id=? AND request_id=?');
    $st->execute([$iid, $rid]);
    $item = $st->fetch();
    if (!$item) err('Позиция не найдена', 404);
    if ((int)$item['is_confirmed'] === 1) err('Позиция уже перенесена в подтверждённые заявки', 409);

    db()->beginTransaction();
    try {
        $suffixSt = db()->prepare('SELECT COALESCE(MAX(suffix_no),0)+1 FROM lk_confirmed_items WHERE source_request_id=?');
        $suffixSt->execute([$rid]);
        $suffixNo = (int)$suffixSt->fetchColumn();

        $ins = db()->prepare(
            'INSERT INTO lk_confirmed_items
                (source_request_id, source_request_item_id, cert_center_id, suffix_no, status,
                 product, tn_ved, model_article, trademark,
                 created_by, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())'
        );
        $ins->execute([
            $rid,
            $iid,
            (int)$request['cert_center_id'],
            $suffixNo,
            'confirmed',
            (string)($item['product'] ?? ''),
            (string)($item['tn_ved'] ?? ''),
            (string)($item['model_article'] ?? ''),
            (string)($item['trademark'] ?? ''),
            (int)$me['sub'],
        ]);
        $newId = (int)db()->lastInsertId();

        db()->prepare('UPDATE lk_cert_request_items SET is_confirmed=1, updated_at=NOW() WHERE id=?')
            ->execute([$iid]);

        db()->commit();
    } catch (\Throwable $e) {
        db()->rollBack();
        err('Ошибка БД: ' . $e->getMessage());
    }

    out(['id' => $newId, 'suffix_no' => $suffixNo], 201);
}

/**
 * PUT /confirmed-items/:id
 *
 * Правка переносимых/редактируемых полей позиции, заявителя, клиента и
 * назначенного сертификационного центра. Доступно только менеджеру.
 */
if ($method === 'PUT' && $seg[0] === 'confirmed-items' && isset($seg[1]) && !isset($seg[2])) {
    $me = auth(true);
    $id = (int)$seg[1];
    confirmed_item_guard($me, $id);

    $b = body();
    $allowed = ['product', 'tn_ved', 'model_article', 'trademark'];
    $set = [];
    $vals = [];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $b)) {
            $set[] = "$f=?";
            $vals[] = (string)$b[$f];
        }
    }

    foreach (['buyer_invoice_paid', 'innoved_invoice_paid'] as $flagField) {
        if (array_key_exists($flagField, $b)) {
            $set[] = "$flagField=?";
            $vals[] = !empty($b[$flagField]) ? 1 : 0;
        }
    }


    if (array_key_exists('applicant_profile_id', $b)) {
        $set[] = 'applicant_profile_id=?';
        $vals[] = $b['applicant_profile_id'] !== null ? (int)$b['applicant_profile_id'] : null;
    }
    if (array_key_exists('client_id', $b)) {
        $set[] = 'client_id=?';
        $vals[] = $b['client_id'] !== null ? (int)$b['client_id'] : null;
    }
    if (array_key_exists('cert_center_id', $b)) {
        $newCertCenterId = (int)$b['cert_center_id'];
        $ccSt = db()->prepare('SELECT id FROM lk_cert_centers WHERE id=? AND is_active=1 LIMIT 1');
        $ccSt->execute([$newCertCenterId]);
        if (!$ccSt->fetch()) err('Сертификационный центр не найден', 404);

        $set[] = 'cert_center_id=?';
        $vals[] = $newCertCenterId;
    }

    if (!$set) err('Нет данных для обновления');

    $vals[] = $id;
    db()->prepare('UPDATE lk_confirmed_items SET ' . implode(',', $set) . ', updated_at=NOW() WHERE id=?')->execute($vals);

    out(['ok' => true]);
}

/**
 * PUT /confirmed-items/:id/status
 *
 * manager и cert_center могут менять статус. Условие: для любого статуса,
 * кроме 'confirmed' и 'rejected', соответствующий файловый слот должен быть уже
 * загружен (is_current=1). 'rejected' — только манагер.
 */
if ($method === 'PUT' && $seg[0] === 'confirmed-items' && isset($seg[1]) && ($seg[2] ?? '') === 'status') {
    $me = auth();
    $id = (int)$seg[1];
    confirmed_item_guard($me, $id);

    if (!in_array($me['role'], ['manager', 'cert_center'], true)) err('Нет доступа', 403);

    $b = body();
    $status = (string)($b['status'] ?? '');
    if (!in_array($status, CONFIRMED_ITEM_ALLOWED_STATUSES, true)) err('Недопустимый статус', 422);

    if ($status === 'rejected' && $me['role'] !== 'manager') {
        err('Только менеджер может отклонить позицию', 403);
    }

    if (!in_array($status, ['confirmed', 'rejected'], true)) {
        $requiredSlot = array_search($status, CONFIRMED_ITEM_SLOT_STATUS_MAP, true);
        if ($requiredSlot === false) err('Недопустимый статус', 422);

        $fileSt = db()->prepare(
            'SELECT id FROM lk_confirmed_item_files WHERE confirmed_item_id=? AND slot=? AND is_current=1 LIMIT 1'
        );
        $fileSt->execute([$id, $requiredSlot]);
        if (!$fileSt->fetch()) {
            err('Перед установкой этого статуса нужно загрузить соответствующий файл', 422);
        }
    }

    db()->prepare('UPDATE lk_confirmed_items SET status=?, updated_at=NOW() WHERE id=?')->execute([$status, $id]);
    out(['ok' => true]);
}

/**
 * PUT /confirmed-items/:id/files/:slot/allow-reupload
 *
 * Менеджер разрешает сертификационному центру перезалить файл в занятом слоте.
 * Разрешение одноразовое: сбрасывается сразу после того, как СЦ им воспользуется
 * (см. обработчик загрузки файла ниже).
 */
if (
    $method === 'PUT'
    && $seg[0] === 'confirmed-items'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'files'
    && isset($seg[3])
    && ($seg[4] ?? '') === 'allow-reupload'
) {
    $me = auth(true);
    $id = (int)$seg[1];
    $slot = (string)$seg[3];
    confirmed_item_guard($me, $id);

    if (!in_array($slot, CONFIRMED_ITEM_ALLOWED_SLOTS, true)) err('Недопустимый слот файла', 422);

    $st = db()->prepare(
        'SELECT id FROM lk_confirmed_item_files WHERE confirmed_item_id=? AND slot=? AND is_current=1 LIMIT 1'
    );
    $st->execute([$id, $slot]);
    $current = $st->fetch();
    if (!$current) err('В этом слоте ещё нет файла — перезалив не требуется, просто загрузите файл', 422);

    db()->prepare('UPDATE lk_confirmed_item_files SET allow_center_reupload=1 WHERE id=?')->execute([$current['id']]);
    out(['ok' => true]);
}

/**
 * POST /confirmed-items/:id/files/:slot
 *
 * Загрузка/замена файла в слоте. Мягкое удаление предыдущей текущей версии.
 * manager: всегда может перезаливать.
 * cert_center: может только если слот пуст, либо если allow_center_reupload=1
 *   у текущей версии (разрешение одноразовое — сбрасывается после использования).
 * client: не имеет доступа (нет в списке допустимых ролей ниже).
 */
if (
    $method === 'POST'
    && $seg[0] === 'confirmed-items'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'files'
    && isset($seg[3])
    && !isset($seg[4])
) {
    $me = auth();
    $id = (int)$seg[1];
    $slot = (string)$seg[3];
    confirmed_item_guard($me, $id);

    if (!in_array($me['role'], ['manager', 'cert_center'], true)) err('Нет доступа', 403);
    if (!in_array($slot, CONFIRMED_ITEM_ALLOWED_SLOTS, true)) err('Недопустимый слот файла', 422);

    $curSt = db()->prepare(
        'SELECT * FROM lk_confirmed_item_files WHERE confirmed_item_id=? AND slot=? AND is_current=1 LIMIT 1'
    );
    $curSt->execute([$id, $slot]);
    $current = $curSt->fetch();

    if ($current && $me['role'] === 'cert_center' && (int)$current['allow_center_reupload'] !== 1) {
        err('Файл уже загружен. Обратитесь к менеджеру за разрешением на замену', 403);
    }

    if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) err('Файл не загружен');
    $file = $_FILES['file'];
    if ($file['size'] > MAX_FILE_SIZE) err('Файл слишком большой (макс. 20 МБ)');
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'], true)) err('Недопустимый тип файла');

    $dir = UPLOAD_PATH . '/confirmed/' . $id;
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $stored = uniqid('cif_') . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $stored)) err('Ошибка сохранения файла');

    db()->beginTransaction();
    try {
        if ($current) {
            db()->prepare('UPDATE lk_confirmed_item_files SET is_current=0, deleted_at=NOW(), allow_center_reupload=0 WHERE id=?')
                ->execute([$current['id']]);
        }

        db()->prepare(
            'INSERT INTO lk_confirmed_item_files
                (confirmed_item_id, slot, filename_original, filename_stored, uploader_id, uploader_role, is_current, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 1, NOW())'
        )->execute([$id, $slot, $file['name'], $stored, (int)$me['sub'], $me['role']]);
        $newFileId = (int)db()->lastInsertId();

        // Автоматическое выставление статуса при загрузке файла (см. docs/PROJECT_CONTEXT.md, п.4).
        $autoStatus = CONFIRMED_ITEM_SLOT_STATUS_MAP[$slot] ?? null;
        if ($autoStatus) {
            db()->prepare('UPDATE lk_confirmed_items SET status=?, updated_at=NOW() WHERE id=?')
                ->execute([$autoStatus, $id]);
        }

        db()->commit();
    } catch (\Throwable $e) {
        db()->rollBack();
        @unlink($dir . '/' . $stored);
        err('Ошибка БД: ' . $e->getMessage());
    }

    out(['id' => $newFileId], 201);
}

/**
 * GET /confirmed-items/:id/files/:slot/download
 */
if (
    $method === 'GET'
    && $seg[0] === 'confirmed-items'
    && isset($seg[1])
    && ($seg[2] ?? '') === 'files'
    && isset($seg[3])
    && ($seg[4] ?? '') === 'download'
) {
    $me = auth();
    $id = (int)$seg[1];
    $slot = (string)$seg[3];
    confirmed_item_guard($me, $id);

    if (!in_array($slot, CONFIRMED_ITEM_ALLOWED_SLOTS, true)) err('Недопустимый слот файла', 422);

    $st = db()->prepare(
        'SELECT * FROM lk_confirmed_item_files WHERE confirmed_item_id=? AND slot=? AND is_current=1 LIMIT 1'
    );
    $st->execute([$id, $slot]);
    $f = $st->fetch();
    if (!$f) err('Файл не найден', 404);

    $path = UPLOAD_PATH . '/confirmed/' . $id . '/' . $f['filename_stored'];
    if (!file_exists($path)) err('Файл не найден', 404);

    send_file_download($path, $f['filename_original']);
}