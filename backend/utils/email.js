const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // Use Gmail defaults if HOST/PORT not set
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = process.env.EMAIL_PORT || 587;
  
  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: port == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Reuse this single transporter for all transactional emails (OTP, contact, orders).
const transporter = createTransporter();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, purpose) => {
  let subject, html;

  if (purpose === 'signup') {
    subject = 'Verify Your Email - Mudgarvale';
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5C3A21;">Welcome to Mudgarvale!</h2>
        <p>Thank you for signing up. Please use the following OTP to verify your email:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #5C3A21;">
          ${otp}
        </div>
        <p>This OTP will expire in <strong>10 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Mudgarvale - Traditional Indian Fitness Equipment</p>
      </div>
    `;
  } else if (purpose === 'login') {
    subject = 'Login OTP - Mudgarvale';
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5C3A21;">Login Verification</h2>
        <p>Use the following OTP to complete your login:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #5C3A21;">
          ${otp}
        </div>
        <p>This OTP will expire in <strong>10 minutes</strong>.</p>
        <p>If you didn't request this, please secure your account immediately.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Mudgarvale - Traditional Indian Fitness Equipment</p>
      </div>
    `;
  } else {
    subject = 'Your OTP - Mudgarvale';
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5C3A21;">Verification Code</h2>
        <p>Your OTP is:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #5C3A21;">
          ${otp}
        </div>
        <p>This OTP will expire in <strong>10 minutes</strong>.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Mudgarvale - Traditional Indian Fitness Equipment</p>
      </div>
    `;
  }

  const mailOptions = {
    from: `"Mudgarvale" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Send contact form email
const sendContactEmail = async ({ name, email, phone, subject, message }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || 'Not provided');
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const mailOptions = {
    from: `"Mudgarvale Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5C3A21;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <div style="background: #f4f4f4; padding: 20px; border-radius: 5px;">
          ${safeMessage}
        </div>
        <hr>
        <p style="color: #666; font-size: 12px;">Sent from Mudgarvale Contact Form</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send confirmed-order email without affecting the order workflow if delivery fails.
const sendOrderConfirmationEmail = async (email, customerName, orderNumber) => {
  const safeName = escapeHtml(customerName);
  const safeOrderNumber = escapeHtml(orderNumber);

  await transporter.sendMail({
    from: `"MudgarVale" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Your MudgarVale Order Has Been Confirmed!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333; line-height: 1.6;">
        <h2 style="color: #5C3A21; margin-top: 0;">Thank you for shopping with MudgarVale!</h2>
        <p>Hi <strong>${safeName}</strong>,</p>
        <p>We're excited to let you know that your order has been placed successfully and is now confirmed.</p>
        <p><strong>Order Number:</strong> ${safeOrderNumber}</p>
        <p>Our team will begin preparing your order shortly. You will receive your tracking details within <strong>4 days</strong>.</p>
        <p>If you have any questions or need any assistance, feel free to contact us.</p>
        <p>📞 <strong>7016243133</strong></p>
        <p>Thank you for choosing <strong>MudgarVale</strong>. We truly appreciate your support and look forward to serving you again!</p>
        <br>
        <p>Warm regards,<br><strong>MudgarVale Team</strong></p>
      </div>
    `,
  });
};

module.exports = { generateOTP, sendOTPEmail, sendContactEmail, sendOrderConfirmationEmail };
