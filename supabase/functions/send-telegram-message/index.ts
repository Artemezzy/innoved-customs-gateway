import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const ALLOWED_ORIGINS = [
  'https://innovedbroker.ru',
  'https://www.innovedbroker.ru',
  'https://id-preview--706c0eaf-9190-4fe5-97a9-48df9371963c.lovable.app',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function sanitize(str: string): string {
  return str.replace(/[<>&"']/g, '').trim();
}

// Escape Markdown special characters to prevent injection
function escapeMarkdown(str: string): string {
  return str.replace(/[_*\[\]()~`>#\+\-=|{}.!\\]/g, '\\$&');
}

function isValidPhone(phone: string): boolean {
  return /^[\d\s\+\-\(\)]{7,20}$/.test(phone);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Слишком много запросов. Попробуйте позже.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const body = await req.json();

    const name = typeof body.name === 'string' ? sanitize(body.name).slice(0, 200) : '';
    const inn = typeof body.inn === 'string' ? sanitize(body.inn).slice(0, 20) : '';
    const phone = typeof body.phone === 'string' ? sanitize(body.phone) : '';
    const email = typeof body.email === 'string' ? sanitize(body.email) : '';
    const message = typeof body.message === 'string' ? sanitize(body.message).slice(0, 2000) : '';

    if (!name) {
      return new Response(
        JSON.stringify({ error: 'Укажите имя' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (!isValidPhone(phone)) {
      return new Response(
        JSON.stringify({ error: 'Укажите корректный номер телефона' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (email && !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Укажите корректный email' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not configured');
    }

    const chatId = Deno.env.get('TELEGRAM_CHAT_ID') || '@your_channel_or_chat_id';
    const threadId = Deno.env.get('TELEGRAM_THREAD_ID');

    const telegramMessage = `
🔔 *Новая заявка с сайта*

👤 *Имя:* ${escapeMarkdown(name)}
🏢 *ИНН:* ${escapeMarkdown(inn)}
📞 *Телефон:* ${escapeMarkdown(phone)}
📧 *Email:* ${escapeMarkdown(email)}
${message ? `💬 *Сообщение:* ${escapeMarkdown(message)}` : ''}

📅 *Дата:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'Markdown',
        ...(threadId && { message_thread_id: parseInt(threadId) }),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Telegram API error:', result);
      throw new Error('Telegram API error');
    }

    console.log('Message sent to Telegram successfully');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('Error in send-telegram-message function:', error);
    return new Response(
      JSON.stringify({ error: 'Произошла ошибка при отправке сообщения' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
