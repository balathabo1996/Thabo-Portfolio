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
      from: process.env.EMAIL_USER,
      to: 'balathabo96@gmail.com', // Your receiving email
      subject: `Portfolio Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #60a5fa;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
            <strong>Message:</strong><br/>
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </div>
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
