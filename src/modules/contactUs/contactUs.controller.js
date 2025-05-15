import { Contact } from "../../../db/models/contact.model.js";
import { sendEmailService } from "../../../services/sendEmail.js";

const submitContactUsForm = async (req, res, next) => {
  try {
    const { name, email, message, subject, phone } = req.body;

    // Save contact to database
    const contact = new Contact({ name, email, message, subject, phone });
    await contact.save();

    // Send email to admin/team
    await sendEmailService({
      to: "uaemmaf2025@gmail.com", // Your company's email address
      subject: `New Contact Form Submission: ${subject}`,
      message: `
<div style="background-color:#f8f9fa; color:#333333; font-family:'Segoe UI', Arial, sans-serif; padding:40px; border-radius:10px; max-width:650px; margin:auto; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
  <header style="margin-bottom:25px; padding-bottom:20px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #e9ecef;">
    <div>
      <h2 style="color:#222222; margin:0; font-size:24px; font-weight:600;">New Contact Form Submission</h2>
      <p style="color:#6c757d; margin:8px 0 0; font-size:14px;">Received on ${currentDate}</p>
    </div>
    <div style="width:48px; height:48px; background-color:#c12026; border-radius:50%; display:flex; align-items:center; justify-content:center;">
      <span style="color:#FFFFFF; font-size:20px;">✉</span>
    </div>
  </header>
  
  <main style="background-color:#ffffff; padding:30px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
    <div style="border-left:4px solid #c12026; padding-left:15px; margin-bottom:25px;">
      <h3 style="margin:0; color:#333333; font-size:18px; font-weight:600;">Contact Details</h3>
  
    </div>
    
    <table style="width:100%; border-collapse:separate; border-spacing:0 12px;">
      <tr>
        <td style="padding:10px 15px; font-weight:600; color:#444444; width:120px; vertical-align:top;">Name:</td>
        <td style="padding:12px 15px; background-color:#f8f9fa; border-radius:5px; box-shadow:inset 0 0 0 1px #e9ecef;">${name}</td>
      </tr>
      <tr>
        <td style="padding:10px 15px; font-weight:600; color:#444444; vertical-align:top;">Email:</td>
        <td style="padding:12px 15px; background-color:#f8f9fa; border-radius:5px; box-shadow:inset 0 0 0 1px #e9ecef;">${email}</td>
      </tr>
      ${phone ? `
      <tr>
        <td style="padding:10px 15px; font-weight:600; color:#444444; vertical-align:top;">Phone:</td>
        <td style="padding:12px 15px; background-color:#f8f9fa; border-radius:5px; box-shadow:inset 0 0 0 1px #e9ecef;">${phone}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding:10px 15px; font-weight:600; color:#444444; vertical-align:top;">Subject:</td>
        <td style="padding:12px 15px; background-color:#f8f9fa; border-radius:5px; box-shadow:inset 0 0 0 1px #e9ecef;">${subject}</td>
      </tr>
      <tr>
        <td style="padding:10px 15px; font-weight:600; color:#444444; vertical-align:top;">Message:</td>
        <td style="padding:0;"></td>
      </tr>
    </table>
    
    <div style="margin-top:5px; padding:18px; background-color:#f8f9fa; border-radius:5px; white-space:pre-line; line-height:1.6; box-shadow:inset 0 0 0 1px #e9ecef;">${message}</div>
    

  </main>
  
  <footer style="margin-top:30px; padding-top:20px;background-color:black; padding:5px; border-radius:10px; font-size:13px; color:#6c757d; text-align:center;">
    <img src="https://uaemmaf.vercel.app/logo3.png" alt="UAE MMAF Logo" style="max-height:50px; margin-bottom:15px; ">

    <p style="margin:10px 0 0;">
      <a href="https://uaemmaf.ae" style="color:#c12026; text-decoration:none; font-weight:500; margin:0 10px;">Website</a>
      <a href="https://uaemmaf.ae/contact" style="color:#c12026; text-decoration:none; font-weight:500; margin:0 10px;">Contact</a>
      <span href="https://uaemmaf.ae/privacy-policy" style="color:#c12026; text-decoration:none; font-weight:500; margin:0 10px;">Privacy Policy</span>
    </p>
    <p style="margin:15px 0 0;">© ${new Date().getFullYear()} UAE Mixed Martial Arts Federation. All rights reserved.</p>
  </footer>
</div>
            `,
    });

    // Send confirmation email to the sender
    // await sendEmailService({
    //     to: email,
    //     subject: "Thank you for contacting UAEMMAF",
    //     message: `
    //         <h2>Thank you for your inquiry</h2>
    //         <p>Dear ${name},</p>
    //         <p>Thank you very much for your inquiry, one of UAEMMAF team will contact you shortly.</p>
    //         <p>Best regards,</p>
    //         <p>UAEMMAF Team</p>
    //     `
    // });

    res.status(200).json({ message: "Message submitted successfully!" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res
      .status(500)
      .json({ message: "Failed to submit message. Please try again later." });
  }
};

export default submitContactUsForm;
