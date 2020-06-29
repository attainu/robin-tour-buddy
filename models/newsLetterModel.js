const mongoose = require('mongoose');
const validator = require('validator');

const newsLetterSchema = new mongoose.Schema({
    email: {
        type: String,
        validate: [validator.isEmail, 'please enter a valid email!'],
        required: [true, 'please enter an email']
    }
})

const News = mongoose.model('News', newsLetterSchema);

module.exports = News