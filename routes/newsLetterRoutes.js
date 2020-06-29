const express = require('express');
const newsCont = require('../controllers/newsLetterController');

const router = express.Router()

router.post('/newsletter', newsCont.createNewUser);

module.exports = router
