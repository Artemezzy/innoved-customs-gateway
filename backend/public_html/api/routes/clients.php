<?php
declare(strict_types=1);

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