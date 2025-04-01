const express = require('express');
const router = express.Router();
const { newsLetterEmailController } = require('../controller/controller');

router.post('/newsLetter', newsLetterEmailController);

module.exports = router;