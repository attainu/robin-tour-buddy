const News = require('../models/newsLetterModel');
const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync')

exports.createNewUser = catchAsync(async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}/signup`;
    const newUser = await News.create(req.body)
    await new Email(newUser, url).sendNewsLetter()
    res.status(200).json({
        status: 'success',
        message: 'Subscribed'
    })
})