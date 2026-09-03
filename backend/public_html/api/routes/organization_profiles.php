<?php
declare(strict_types=1);

// GET /api/organization-profiles?client_id=123&type=applicant
if ($method === 'GET' && $seg[0] === 'organization-profiles' && !isset($seg[1])) {
    $me = auth();

    $clientId = (int)($_GET['client_id'] ?? 0);
    $type = organization_profile_type((string)($_GET['type'] ?? ''));

    if ($clientId <= 0) {
        err('client_id обязателен', 422);
    }

    organization_profiles_guard($me, $clientId);

    $st = db()->prepare(
        'SELECT
            id,
            client_id,
            profile_type,
            name,
            address,
            head,
            position,
            email,
            country,
            created_by_user_id,
            created_at,
            updated_at
         FROM lk_organization_profiles
         WHERE client_id=? AND profile_type=?
         ORDER BY name ASC, id ASC'
    );

    $st->execute([$clientId, $type]);
    out($st->fetchAll());
}

// GET /api/organization-profiles/check?client_id=123&type=applicant&name=...
if (
    $method === 'GET'
    && $seg[0] === 'organization-profiles'
    && ($seg[1] ?? '') === 'check'
) {
    $me = auth();

    $clientId = (int)($_GET['client_id'] ?? 0);
    $type = organization_profile_type((string)($_GET['type'] ?? ''));
    $name = trim((string)($_GET['name'] ?? ''));

    if ($clientId <= 0) {
        err('client_id обязателен', 422);
    }

    if ($name === '') {
        err('name обязателен', 422);
    }

    organization_profiles_guard($me, $clientId);

    $st = db()->prepare(
        'SELECT
            id,
            client_id,
            profile_type,
            name,
            address,
            head,
            position,
            email,
            country,
            created_by_user_id,
            created_at,
            updated_at
         FROM lk_organization_profiles
         WHERE client_id=?
           AND profile_type=?
           AND LOWER(TRIM(name)) = LOWER(TRIM(?))
         ORDER BY id ASC
         LIMIT 1'
    );

    $st->execute([$clientId, $type, $name]);
    $profile = $st->fetch();

    out([
        'exists' => (bool)$profile,
        'profile' => $profile ?: null,
    ]);
}

// POST /api/organization-profiles
if ($method === 'POST' && $seg[0] === 'organization-profiles' && !isset($seg[1])) {
    $me = auth();
    $data = body();

    $clientId = (int)($data['client_id'] ?? 0);
    $type = organization_profile_type((string)($data['profile_type'] ?? ''));

    if ($clientId <= 0) {
        err('client_id обязателен', 422);
    }

    organization_profiles_guard($me, $clientId);

    $profile = organization_profile_payload($data, $type);

    $st = db()->prepare(
        'INSERT INTO lk_organization_profiles(
            client_id,
            profile_type,
            name,
            address,
            head,
            position,
            email,
            country,
            created_by_user_id,
            created_at,
            updated_at
         ) VALUES(?,?,?,?,?,?,?,?,?,NOW(),NOW())'
    );

    $st->execute([
        $clientId,
        $type,
        $profile['name'],
        $profile['address'],
        $profile['head'],
        $profile['position'],
        $profile['email'],
        $profile['country'],
        (int)$me['sub'],
    ]);

    $id = (int)db()->lastInsertId();

    $created = db()->prepare(
        'SELECT
            id,
            client_id,
            profile_type,
            name,
            address,
            head,
            position,
            email,
            country,
            created_by_user_id,
            created_at,
            updated_at
         FROM lk_organization_profiles
         WHERE id=?'
    );
    $created->execute([$id]);

    out($created->fetch(), 201);
}

// PUT /api/organization-profiles/:id
if (
    $method === 'PUT'
    && $seg[0] === 'organization-profiles'
    && isset($seg[1])
    && !isset($seg[2])
) {
    $me = auth();
    $profileId = (int)$seg[1];

    $existingSt = db()->prepare(
        'SELECT * FROM lk_organization_profiles WHERE id=? LIMIT 1'
    );
    $existingSt->execute([$profileId]);
    $existing = $existingSt->fetch();

    if (!$existing) {
        err('Организация не найдена', 404);
    }

    organization_profiles_guard($me, (int)$existing['client_id']);

    $data = body();
    $type = organization_profile_type((string)$existing['profile_type']);
    $profile = organization_profile_payload($data, $type);

    db()->prepare(
        'UPDATE lk_organization_profiles
         SET
            name=?,
            address=?,
            head=?,
            position=?,
            email=?,
            country=?,
            updated_at=NOW()
         WHERE id=?'
    )->execute([
        $profile['name'],
        $profile['address'],
        $profile['head'],
        $profile['position'],
        $profile['email'],
        $profile['country'],
        $profileId,
    ]);

    $updatedSt = db()->prepare(
        'SELECT
            id,
            client_id,
            profile_type,
            name,
            address,
            head,
            position,
            email,
            country,
            created_by_user_id,
            created_at,
            updated_at
         FROM lk_organization_profiles
         WHERE id=?'
    );
    $updatedSt->execute([$profileId]);

    out($updatedSt->fetch());
}