import nodemailer from 'nodemailer'

export async function sendEmailService({
  to,
  subject,
  message,
  attachments = [],
} = {}) {
  // configurations  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // smtp.gmail.com
    port: 587, // 587 , 465
    secure: false, // false , true
    service: 'gmail', // optional
    auth: {
      // credentials
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const emailInfo = await transporter.sendMail({
    from: `"UAEMMAF " ${process.env.SMTP_USER}`,
    to: to ? to : '',
    subject: subject ? subject : 'Home Designs Notification',
    html: message ? message : '',
    attachments,
  })
  if (emailInfo.accepted.length) {
    return true
  }
  return false
}




// Generate a random 5-digit code
export const sendVerificationEmail = async (toEmail, verificationCode) => {

  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"UAEMMA" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Reset Your Bin Code',
    html: `
      <div style="max-width: 600px; margin: 0 auto; background-color: #1C1C1C; padding: 40px; border-radius: 16px; text-align: center; font-family: 'Segoe UI', Arial, sans-serif; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header with Logo -->
        <div style="margin-bottom: 30px;">
          <h1 style="color: #D4AF37; font-size: 28px; margin: 0; font-weight: 600;">UAE MMA</h1>
          <div style="width: 60px; height: 3px; background-color: #D4AF37; margin: 15px auto;"></div>
        </div>

        <!-- Main Content -->
        <div style="background-color: #252525; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
          <h2 style="color: #D4AF37; margin-bottom: 25px; font-size: 24px; font-weight: 500;">Reset Your Bin Code</h2>
          
          <p style="color: #E0E0E0; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
            Hello,
          </p>
          
          <p style="color: #E0E0E0; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            You requested to reset your bin code. Please use the verification code below to proceed with the reset process:
          </p>
          
          <!-- Verification Code Box -->
          <div style="background-color: #BB2121; color: #fff; font-weight: bold; font-size: 24px; padding: 15px 40px; border-radius: 12px; letter-spacing: 3px; margin: 30px auto; display: inline-block; box-shadow: 0 2px 4px rgba(187, 33, 33, 0.2);">
            ${verificationCode}
          </div>

          <!-- Security Note -->
          <p style="color: #888; font-size: 14px; margin-top: 20px; font-style: italic;">
            This code will expire in 10 minutes for security reasons.
          </p>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #333; padding-top: 20px;">
          <p style="color: #D4AF37; font-size: 14px; margin: 0;">— UAE MMA Team</p>
          <p style="color: #888; font-size: 12px; margin: 10px 0 0;">If you didn't request this code, please ignore this email.</p>
        </div>
      </div>
    `,
  };
  

  await transporter.sendMail(mailOptions);
};