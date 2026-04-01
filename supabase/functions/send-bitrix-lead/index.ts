import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const ALLOWED_ORIGINS = [
  'https://innovedbroker.ru',
  'https://www.innovedbroker.ru',
  'https://id-preview--706c0eaf-9190-4fe5-97a9-48df9371963c.lovable.app',
  'https://706c0eaf-9190-4fe5-97a9-48df9371963c.lovableproject.com',
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

// Simple in-memory rate limiter (per-instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60_000; // per 60 seconds

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

// Validation helpers
function sanitize(str: string): string {
  return str.replace(/[<>&"']/g, '').trim();
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
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Слишком много запросов. Попробуйте позже.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const body = await req.json();

    // Validate required fields
    const name = typeof body.name === 'string' ? sanitize(body.name) : '';
    const phone = typeof body.phone === 'string' ? sanitize(body.phone) : '';
    const email = typeof body.email === 'string' ? sanitize(body.email) : '';
    const message = typeof body.message === 'string' ? sanitize(body.message).slice(0, 2000) : '';

    if (!name || name.length < 1 || name.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Укажите корректное имя' }),
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

    const webhookUrl = Deno.env.get('BITRIX24_WEBHOOK_URL');
    if (!webhookUrl) {
      throw new Error('BITRIX24_WEBHOOK_URL not configured');
    }

    // 1. Create Contact
    const contactRes = await fetch(`${webhookUrl}/crm.contact.add.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          NAME: name,
          PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
          ...(email && { EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }] }),
        },
      }),
    });

    const contactData = await contactRes.json();
    if (!contactRes.ok || contactData.error) {
      console.error('Bitrix24 contact error:', contactData);
      throw new Error('Failed to create contact');
    }

    const contactId = contactData.result;
    console.log('Contact created:', contactId);

    // 2. Create Lead linked to Contact
    const leadRes = await fetch(`${webhookUrl}/crm.lead.add.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          TITLE: `Заявка с сайта — ${name}`,
          NAME: name,
          PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
          ...(email && { EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }] }),
          ...(message && { COMMENTS: message }),
          CONTACT_ID: contactId,
          SOURCE_ID: 'WEB',
          SOURCE_DESCRIPTION: 'innovedbroker.ru',
        },
      }),
    });

    const leadData = await leadRes.json();
    if (!leadRes.ok || leadData.error) {
      console.error('Bitrix24 lead error:', leadData);
      throw new Error('Failed to create lead');
    }

    console.log('Lead created:', leadData.result);

    // 3. Create Open Line chat linked to the Lead
    try {
      const olRes = await fetch(`${webhookUrl}/imopenlines.crm.chat.create.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CRM_ENTITY_TYPE: 'LEAD',
          CRM_ENTITY_ID: leadData.result,
          LINE_ID: 1,
        }),
      });
      const olData = await olRes.json();
      if (olData.error) {
        console.error('Open Line chat error:', olData);
      } else {
        console.log('Open Line chat created:', olData.result);
      }
    } catch (olError) {
      console.error('Open Line chat error (non-blocking):', olError);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('Error in send-bitrix-lead:', error);
    return new Response(
      JSON.stringify({ error: 'Произошла ошибка при обработке заявки' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
