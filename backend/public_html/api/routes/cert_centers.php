<?php
declare(strict_types=1);

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