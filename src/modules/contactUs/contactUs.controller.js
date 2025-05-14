import { Contact } from "../../../db/models/contact.model.js";
import { sendEmailService } from "../../../services/sendEmail.js";

const submitContactUsForm = async (req, res, next) => {
    try {
        const { name, email, message, subject, phone} = req.body;
        
        // Save contact to database
        const contact = new Contact({name, email, message, subject, phone});
        await contact.save();
        
        // Send email to admin/team
        await sendEmailService({
            to: "Web@uaemmaf.com", // Your company's email address
            subject: `New Contact Form Submission: ${subject}`,
            message: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        });
        
        // Send confirmation email to the sender
        await sendEmailService({
            to: email,
            subject: "Thank you for contacting UAEMMAF",
            message: `
                <h2>Thank you for your inquiry</h2>
                <p>Dear ${name},</p>
                <p>Thank you very much for your inquiry, one of UAEMMAF team will contact you shortly.</p>
                <p>Best regards,</p>
                <p>UAEMMAF Team</p>
            `
        });
        
        res.status(200).json({ message: "Message submitted successfully!" });
    } catch (error) {
        console.error("Error submitting contact form:", error);
        res.status(500).json({ message: "Failed to submit message. Please try again later." });
    }
};

export default submitContactUsForm;
