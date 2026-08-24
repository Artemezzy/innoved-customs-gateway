<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';

$cronSecret = $_GET['secret'] ?? '';
if (!hash_equals(CRON_SECRET, $cronSecret)) {
    http_response_code(403);
    exit('Forbidden');
}

$pdo = new PDO(
    'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4',
    DB_USER, DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
);

$st = $pdo->prepare(
    "SELECT * FROM lk_notification_queue
     WHERE status='pending' AND last_event_at <= (NOW() - INTERVAL 60 SECOND)"
);
$st->execute();
$queueItems = $st->fetchAll();

foreach ($queueItems as $item) {
    $rid = (int)$item['entity_id'];
    $recipientRole = $item['recipient_role'];

    $rq = $pdo->prepare('SELECT cert_center_id FROM lk_cert_requests WHERE id=?');
    $rq->execute([$rid]);
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

    if (empty($recipients)) {
        $pdo->prepare("UPDATE lk_notification_queue SET status='sent', sent_at=NOW() WHERE id=?")->execute([$item['id']]);
        continue;
    }

    $eventsHtml = implode('<br>', array_map('htmlspecialchars', explode("\n", $item['event_summary'])));
    $subject = "Заявка №{$rid}: {$item['events_count']} " . ($item['events_count'] === 1 ? 'обновление' : 'обновлений');
    $link = "https://www.innovedbroker.ru/lk/cert-requests/{$rid}";
    $html = "<p>По заявке №{$rid} произошли изменения:</p>"
          . "<p>{$eventsHtml}</p>"
          . "<p><a href=\"{$link}\">Перейти в заявку</a></p>";

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

function send_via_resend(string $to, string $subject, string $html): bool {
    $payload = json_encode([
        'from' => 'INNOVED LK <noreply@updates.innovedbroker.ru>',
        'to' => $to,
        'subject' => $subject,
        'html' => $html,
    ]);

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . RESEND_API_KEY,
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => $payload,
    ]);
    curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode >= 200 && $httpCode < 300;
}

echo "Processed: " . count($queueItems) . " queue items\n";
