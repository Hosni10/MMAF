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
      <div style="background-color: #1C1C1C; padding: 40px; border-radius: 12px; text-align: center; font-family: Arial, sans-serif;">
        <h2 style="color: #D4AF37; margin-bottom: 20px;">Reset Your Bin Code</h2>
        
        <p style="color: #E0E0E0; font-size: 16px; margin: 0 0 10px;">Hello,</p>
        
        <p style="color: #E0E0E0; font-size: 16px; margin-bottom: 30px;">
          You requested to reset your bin code. Use the verification code below to proceed:
        </p>
        
        <div style="display: inline-block; background-color: #BB2121; color: #fff; font-weight: bold; font-size: 20px; padding: 12px 30px; border-radius: 10px; letter-spacing: 2px; margin-bottom: 30px;">
          ${verificationCode}
        </div>
        
        <p style="color: #D4AF37; font-size: 14px; margin-top: 40px;">— UAE MMA Team</p>
      </div>
    `,
  };
  

  await transporter.sendMail(mailOptions);
};