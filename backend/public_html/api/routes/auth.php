<?php
declare(strict_types=1);

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