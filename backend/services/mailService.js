// File: backend/services/mailService.js

const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from .env
    pass: process.env.EMAIL_PASS, // Your Gmail App Password from .env
  },
});

/**
 * Sends a password reset email to a user.
 * @param {string} to - The recipient's email address.
 * @param {string} link - The password reset link.
 */
async function sendPasswordResetEmail(to, link) {
  const mailOptions = {
    from: `"MovRec" <${process.env.EMAIL_USER}>`, // Sender address
    to: to, // List of receivers
    subject: 'Your Password Reset Link for MovRec', // Subject line
    text: `You requested a password reset. Click the link to reset your password: ${link}`, // Plain text body
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your MovRec account.</p>
        <p>Please click the button below to set a new password. This link is valid for 15 minutes.</p>
        <a href="${link}" style="background-color: #0d6efd; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
        <p>If you did not request this, please ignore this email.</p>
        <hr>
        <p><em>MovRec Team</em></p>
      </div>
    `, // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
    // We throw the error so the route handler knows something went wrong.
    throw new Error('Failed to send password reset email.');
  }
}

module.exports = {
  sendPasswordResetEmail,
};