"use server";

import nodemailer from "nodemailer";

export async function sendContactEmail(values: { 
  name: string; 
  email: string; 
  subject: string; 
  message: string; 
}) {
  const { name, email, subject, message } = values;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.CONTACT_EMAIL, 
      replyTo: email,
      subject: `[SUPPORT] ${subject}`,
      text: message,
      html: `
        <div style="font-family: sans-serif; padding: 24px; color: #1a1a1a;">
          <h2 style="font-size: 20px; font-weight: 800; border-bottom: 2px solid #eee; padding-bottom: 12px;">
            New Support Request
          </h2>
          <div style="margin-top: 20px; line-height: 1.6;">
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin-top: 15px; border: 1px solid #eee;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 12px;">
            This email was sent via the Quizzy AI Contact Form.
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Email error:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
}
