<?php
declare(strict_types=1);

// GET /api/managers/stats
if ($method === 'GET' && $seg[0] === 'managers' && ($seg[1] ?? '') === 'stats') {
    auth(true);
    out([
        'clients_count' => (int) db()->query('SELECT COUNT(*) FROM lk_clients WHERE is_active=1')->fetchColumn(),
        'shipments_active' => (int) db()->query("SELECT COUNT(*) FROM lk_shipments WHERE status NOT IN('released','on_hold')")->fetchColumn(),
        'messages_unread' => (int) db()->query("SELECT COUNT(*) FROM lk_messages WHERE is_read=0 AND role='client'")->fetchColumn(),
    ]);
}

// GET /api/managers/cert-stats

if ($method === 'GET' && $seg[0] === 'managers' && ($seg[1] ?? '') === 'cert-stats') {
    auth(true);
    out(['cert_centers_count' => (int) db()->query('SELECT COUNT(*) FROM lk_cert_centers WHERE is_active=1')->fetchColumn(), 'cert_requests_open' => (int) db()->query("SELECT COUNT(*) FROM lk_cert_requests WHERE status!='closed'")->fetchColumn()]);
}


// GET /api/managers/messages
if ($method === 'GET' && $seg[0] === 'managers' && ($seg[1] ?? '') === 'messages') {
    auth(true);
    $st = db()->query("
        SELECT s.id AS shipment_id,
               s.title,
               c.name AS client_name,
               m.text AS last_message,
               m.created_at AS last_message_at,
               (SELECT COUNT(*) FROM lk_messages
                WHERE shipment_id=s.id AND is_read=0 AND role='client') AS unread_count
        FROM lk_shipments s
        JOIN lk_clients c ON c.id=s.client_id
        JOIN lk_messages m ON m.id=(SELECT MAX(id) FROM lk_messages WHERE shipment_id=s.id)
        ORDER BY m.created_at DESC
        LIMIT 50
    ");
    out($st->fetchAll());
}