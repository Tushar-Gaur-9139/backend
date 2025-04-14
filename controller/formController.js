const transporter = require('../config/emailConfig');
const path = require('path');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Folder to save uploaded files
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Controller to handle form submission
const formController = async (req, res) => {
    const { name, email, phone, companyName, message } = req.body;
    const attachment = req.file;

    console.log(req.body);
    console.log('Uploaded file:', attachment);

    // Input validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }
    if (!phone || phone.length < 10) {
        return res.status(400).json({ success: false, message: 'Invalid phone number.' });
    }
    if (!name || name.length < 3) {
        return res.status(400).json({ success: false, message: 'Name must be at least 3 characters.' });
    }
    if (!companyName || companyName.trim() === '') {
        return res.status(400).json({ success: false, message: 'Invalid company name.' });
    }
    if (!message || message.length < 50) {
        return res.status(400).json({ success: false, message: 'Message must be at least 50 characters.' });
    }

    try {
        // Set up email content
        const mailOptions = {
            from: `"Satvik-Tech" <${process.env.EMAIL_USER}>`,
            to:  process.env.EMAIL_USER,
            subject: `Message from ${name}`,
            text: `${message}\n\nDetails:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${companyName}`,
            attachments: attachment
                ? [
                      {
                          filename: attachment.originalname,
                          path: path.join(__dirname, '../uploads', attachment.filename),
                      },
                  ]
                : [],
        };

        // Send email
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
