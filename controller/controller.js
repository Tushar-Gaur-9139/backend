const transporter = require('../config/emailConfig');

const newsLetterEmailController = async (req, res) => {
    const { userEmail, subject, text } = req.body;
console.log(req.body);
    // Validate the email address
    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    try {
        // Send the email using nodemailer
        const info = await transporter.sendMail({
            from: `"Satvik-Tech" <${process.env.EMAIL_USER}>`, // Sender address
            to: `"Satvik-Tech" <${process.env.EMAIL_USER}>`, // Recipient's email address
            subject: subject, // Subject line
            text: `${text} - ${userEmail}`, // Plain text body
        });

        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ success: true, message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
};

module.exports = {
    newsLetterEmailController,
};