const transporter = require('../config/emailConfig');
const path = require('path');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Specify the uploads folder
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`); // Rename the file with a timestamp
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf',  'application/doc', 'application/docx'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('.jpeg, and .png files are allowed.'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Controller to handle form submission
const formController = async (req, res) => {
    const { name, email, phone, companyName, message } = req.body;
    const attachment = req.file; // Access the uploaded file

    console.log(req.body);
    console.log('Uploaded file:', attachment);

    // Validate inputs
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }
    if (!phone || phone.length < 10) {
        return res.status(400).json({ success: false, message: 'Invalid phone number.' });
    }
    if (!name || name.length < 10) {
        return res.status(400).json({ success: false, message: 'Invalid name.' });
    }
    if (!companyName || " ") {
        return res.status(400).json({ success: false, message: 'Invalid company name.' });
    }
    if (!message || message.length < 50) {
        return res.status(400).json({ success: false, message: 'Invalid message.' });
    }

    try {
        // Send the email using nodemailer
        const mailOptions = {
            from: `"Satvik-Tech" <${process.env.EMAIL_USER}>`, // Sender address
            to: email, // Recipient's email address
            subject: `Message from ${name}`, // Subject line
            text: `${message} - ${email} - ${name} - ${companyName} - ${phone}`, // Plain text body
            attachments: attachment
                ? [
                      {
                          filename: attachment.originalname,
                          path: path.join(__dirname, '../uploads', attachment.filename),
                      },
                  ]
                : [],
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ success: true, message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
};

module.exports = {
    formController,
    upload, // Export multer middleware
};