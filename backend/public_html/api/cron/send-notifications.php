<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';

$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER,
    DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
);

$st = $pdo->prepare(
    "SELECT * FROM lk_notification_queue
     WHERE status='pending' AND last_event_at <= (NOW() - INTERVAL 60 SECOND)"
);
$st->execute();
$queueItems = $st->fetchAll();

foreach ($queueItems as $item) {
    $entityType = $item['entity_type'];
    $entityId = (int)$item['entity_id'];
    $recipientRole = $item['recipient_role'];

    $recipients = [];
    $link = '';
    $subjectPrefix = '';

    if ($entityType === 'cert_request') {
        $rq = $pdo->prepare('SELECT cert_center_id FROM lk_cert_requests WHERE id=?');
        $rq->execute([$entityId]);
        $request = $rq->fetch();
        if (!$request) {
            $pdo->prepare("UPDATE lk_notification_queue SET status='failed' WHERE id=?")->execute([$item['id']]);
            continue;
        }

        if ($recipientRole === 'manager') {
            $usersSt = $pdo->prepare(
                "SELECT id, email, name FROM lk_users WHERE role='manager' AND is_active=1 AND notifications_enabled=1"
            );
            $usersSt->execute();
        } else {
            $usersSt = $pdo->prepare(
                "SELECT id, email, name FROM lk_users
                 WHERE role='cert_center' AND cert_center_id=? AND is_active=1 AND notifications_enabled=1"
            );
            $usersSt->execute([$request['cert_center_id']]);
        }
        $recipients = $usersSt->fetchAll();
        $link = "https://www.innovedbroker.ru/lk/cert-requests/{$entityId}";
        $subjectPrefix = "Заявка №{$entityId}";
    } elseif ($entityType === 'shipment') {
        $rq = $pdo->prepare('SELECT client_id FROM lk_shipments WHERE id=?');
        $rq->execute([$entityId]);
        $shipment = $rq->fetch();
        if (!$shipment) {
            $pdo->prepare("UPDATE lk_notification_queue SET status='failed' WHERE id=?")->execute([$item['id']]);
            continue;
        }

        if ($recipientRole === 'manager') {
            $usersSt = $pdo->prepare(
                "SELECT id, email, name FROM lk_users WHERE role='manager' AND is_active=1 AND notifications_enabled=1"
            );
            $usersSt->execute();
        } else {
            $usersSt = $pdo->prepare(
                "SELECT id, email, name FROM lk_users
                 WHERE role='client' AND client_id=? AND is_active=1 AND notifications_enabled=1"
            );
            $usersSt->execute([$shipment['client_id']]);
        }
        $recipients = $usersSt->fetchAll();
        $link = "https://www.innovedbroker.ru/lk/shipments/{$entityId}";
        $subjectPrefix = "Поставка №{$entityId}";
    } else {
        $pdo->prepare("UPDATE lk_notification_queue SET status='failed' WHERE id=?")->execute([$item['id']]);
        continue;
    }

    if (empty($recipients)) {
        $pdo->prepare("UPDATE lk_notification_queue SET status='sent', sent_at=NOW() WHERE id=?")->execute([$item['id']]);
        continue;
    }

    $eventsHtml = implode('<br>', array_map('htmlspecialchars', explode("\n", $item['event_summary'])));
    $subject = "{$subjectPrefix}: {$item['events_count']} " . ($item['events_count'] === 1 ? 'обновление' : 'обновлений');
    $html = "<div style=\"font-family:sans-serif;font-size:14px;color:#222;\">"
        . "<p>{$subjectPrefix} — произошли изменения:</p>"
        . "<div style=\"background:#f5f5f5;border-radius:6px;padding:12px;margin:12px 0;\">{$eventsHtml}</div>"
        . "<p><a href=\"{$link}\" style=\"color:#1a56db;\">Перейти в личный кабинет</a></p>"
        . "</div>";

    $allSent = true;
    $emailsSt = $pdo->prepare('SELECT email FROM lk_notification_emails WHERE user_id=? ORDER BY id ASC');

    foreach ($recipients as $recipient) {
        $emailsSt->execute([(int)$recipient['id']]);
        $emails = array_map(
            static fn(array $row) => mb_strtolower(trim((string)$row['email'])),
            $emailsSt->fetchAll()
        );
        $emails = array_values(array_filter(array_unique($emails)));

        if (!$emails) {
            $fallbackEmail = mb_strtolower(trim((string)$recipient['email']));
            if ($fallbackEmail !== '' && filter_var($fallbackEmail, FILTER_VALIDATE_EMAIL)) {
                $emails = [$fallbackEmail];
            }
        }

        foreach ($emails as $email) {
            $ok = send_via_resend($email, $subject, $html);
            if (!$ok) $allSent = false;
        }
    }

    $pdo->prepare(
        "UPDATE lk_notification_queue SET status=?, sent_at=NOW() WHERE id=?"
    )->execute([$allSent ? 'sent' : 'failed', $item['id']]);
}

function send_via_resend(string $to, string $subject, string $html): bool
{
    $payload = json_encode([
        'from' => 'INNOVED LK <notifications@innovedbroker.ru>',
        'to' => [$to],
        'subject' => $subject,
        'html' => $html,
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . RESEND_API_KEY,
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_TIMEOUT => 10,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $response !== false && $httpCode >= 200 && $httpCode < 300;
}
