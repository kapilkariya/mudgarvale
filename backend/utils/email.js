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

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, purpose) => {
  const transporter = createTransporter();

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

module.exports = { generateOTP, sendOTPEmail };
