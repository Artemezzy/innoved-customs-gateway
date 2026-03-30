import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface FormRequest {
  name: string;
  phone: string;
  email?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, phone, email, message }: FormRequest = await req.json();

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ error: 'Name and phone are required' }),
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
      throw new Error(contactData.error_description || 'Failed to create contact');
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
      throw new Error(leadData.error_description || 'Failed to create lead');
    }

    console.log('Lead created:', leadData.result);

    // 3. Send notification to Bitrix24 group chat
    const chatMessage = `🔔 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}${email ? `\n📧 Email: ${email}` : ''}${message ? `\n💬 Сообщение: ${message}` : ''}\n\n🔗 Лид #${leadData.result}`;

    try {
      const chatRes = await fetch(`${webhookUrl}/im.message.add.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          DIALOG_ID: 'chat477',
          MESSAGE: chatMessage,
        }),
      });
      const chatData = await chatRes.json();
      console.log('Chat notification sent:', chatData.result);
    } catch (chatError) {
      console.error('Chat notification error (non-blocking):', chatError);
    }

    // 4. Create Open Line chat linked to the Lead
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
      JSON.stringify({ success: true, contactId, leadId: leadData.result }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('Error in send-bitrix-lead:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
