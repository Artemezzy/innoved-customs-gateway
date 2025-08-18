import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  inn: string;
  phone: string;
  email: string;
  language: 'ru' | 'en' | 'zh';
}

const serve_handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing contact form submission");
    
    const { name, inn, phone, email, language }: ContactRequest = await req.json();
    
    console.log("Form data received:", { name, inn, phone, email, language });

    // Determine email subject and content based on language
    const subjects = {
      ru: "Новая заявка с сайта Innoved Broker",
      en: "New request from Innoved Broker website", 
      zh: "来自Innoved Broker网站的新申请"
    };

    const subject = subjects[language] || subjects.ru;

    // Create email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          ${language === 'ru' ? 'Новая заявка с сайта' : 
            language === 'en' ? 'New website request' : 
            '新的网站申请'}
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">
            ${language === 'ru' ? 'Информация о клиенте:' : 
              language === 'en' ? 'Client Information:' : 
              '客户信息：'}
          </h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">
                ${language === 'ru' ? 'Имя:' : 
                  language === 'en' ? 'Name:' : 
                  '姓名：'}
              </td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">
                ${language === 'ru' ? 'ИНН компании:' : 
                  language === 'en' ? 'Company TIN:' : 
                  '公司税号：'}
              </td>
              <td style="padding: 8px 0;">${inn}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">
                ${language === 'ru' ? 'Телефон:' : 
                  language === 'en' ? 'Phone:' : 
                  '电话：'}
              </td>
              <td style="padding: 8px 0;">
                <a href="tel:${phone}" style="color: #007bff; text-decoration: none;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">
                ${language === 'ru' ? 'Email:' : 
                  language === 'en' ? 'Email:' : 
                  '邮箱：'}
              </td>
              <td style="padding: 8px 0;">
                <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">
                ${language === 'ru' ? 'Язык сайта:' : 
                  language === 'en' ? 'Website Language:' : 
                  '网站语言：'}
              </td>
              <td style="padding: 8px 0;">${language.toUpperCase()}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            ${language === 'ru' ? 
              'Эта заявка была отправлена через контактную форму на сайте Innoved Broker.' : 
              language === 'en' ? 
              'This request was submitted through the contact form on the Innoved Broker website.' : 
              '此申请通过Innoved Broker网站的联系表单提交。'}
          </p>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
            ${language === 'ru' ? 
              'Дата отправки: ' + new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) : 
              language === 'en' ? 
              'Submitted on: ' + new Date().toLocaleString('en-US') : 
              '提交时间：' + new Date().toLocaleString('zh-CN')}
          </p>
        </div>
      </div>
    `;

    console.log("Sending email to info@innovedbroker.ru");

    const emailResponse = await resend.emails.send({
      from: "Innoved Broker <noreply@innovedbroker.ru>",
      to: ["info@innovedbroker.ru"],
      subject: subject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(serve_handler);