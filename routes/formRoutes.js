const express = require('express');
const router = express.Router();
const { formController, upload } = require('../controller/formController');

// Use multer middleware for file uploads
router.post('/career', upload.single('attachment'), formController);

module.exports = router;