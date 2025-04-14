const transporter = require('../config/emailConfig');

const contactController = async (req, res) => {
    const { name, email, phone, companyName, message } = req.body;

    // Validate the email address
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }
    if (!phone) {
        return res.status(400).json({ success: false, message: 'Invalid phone number.' });
    }
    if (!name ) {
        return res.status(400).json({ success: false, message: 'Invalid name.' });
    }
    if (!companyName) {
        return res.status(400).json({ success: false, message: 'Invalid company name.' });
    }
    if (!message) {
        return res.status(400).json({ success: false, message: 'Invalid message.' });
    }

    console.log(req.body);
    try {
        // Send the email using nodemailer
        const info = await transporter.sendMail({
            from: `"Satvik-Tech" <${process.env.EMAIL_USER}>`, // Sender address
            to:  process.env.EMAIL_USER, // Recipient's email address
            subject: `Message from ${name}`, // Subject line
            text: `${message} - ${email} - ${name} - ${companyName} - ${phone}` // Plain text body
        });

        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ success: true, message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
};

module.exports = {
    contactController,
};