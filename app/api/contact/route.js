/**
 * API Route: /api/contact  —  app/api/contact/route.js
 * ======================================================
 * POST — Accepts a contact form submission and delivers it to the
 *         portfolio owner's inbox via Nodemailer + Gmail SMTP.
 *
 * Request body (JSON):
 *   name     {string}  Sender's full name
 *   email    {string}  Sender's email address
 *   subject  {string}  Message subject
 *   message  {string}  Message body (plain text; newlines converted to <br>)
 *
 * Environment variables required:
 *   EMAIL_USER  – Gmail address used as the SMTP sender
 *   EMAIL_PASS  – Gmail App Password (not the account password)
 *
 * Responses:
 *   200  { message: "Email sent successfully" }
 *   500  { error:   "Failed to send email"    }
 */
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';


export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    // Create a transporter using Gmail (default recommendation)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use an App Password from Google
      },
    });

    // Email to the portfolio owner (You)
    const mailOptions = {
      from: `"Thabo Portfolio" <${process.env.EMAIL_USER}>`,
      to: 'balathabo96@gmail.com',
      replyTo: email, // Allows you to just click "Reply" in your email client
      subject: `🚀 New Inquiry: ${subject} from ${name}`,
      text: `New message from ${name} (${email}):\n\nSubject: ${subject}\n\n${message}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); padding: 30px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
            .content { padding: 40px; background: #ffffff; }
            .info-grid { display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 30px; }
            .info-item { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #0072ff; }
            .info-item strong { display: block; color: #0072ff; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
            .info-item span { font-size: 16px; font-weight: 600; }
            .message-box { background: #f0f4f8; padding: 25px; border-radius: 12px; border: 1px dashed #cbd5e0; margin-top: 20px; }
            .message-box strong { display: block; margin-bottom: 10px; color: #2d3748; }
            .footer { padding: 20px; text-align: center; background: #f8f9fa; font-size: 12px; color: #718096; }
            .btn { display: inline-block; padding: 12px 30px; background: #0072ff; color: white !important; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px; transition: background 0.3s ease; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Portfolio Message</h1>
            </div>
            <div class="content">
              <div class="info-grid">
                <div class="info-item">
                  <strong>Sender Name</strong>
                  <span>${name}</span>
                </div>
                <div class="info-item">
                  <strong>Email Address</strong>
                  <span>${email}</span>
                </div>
                <div class="info-item">
                  <strong>Subject</strong>
                  <span>${subject}</span>
                </div>
              </div>

              <div class="message-box">
                <strong>Message Content:</strong>
                ${message.replace(/\n/g, '<br/>')}
              </div>

              <div style="text-align: center;">
                <a href="mailto:${email}" class="btn">Reply to ${name}</a>
              </div>
            </div>
            <div class="footer">
              This email was sent from your portfolio contact form system.<br/>
              &copy; ${new Date().getFullYear()} Thabo.Portfolio
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
