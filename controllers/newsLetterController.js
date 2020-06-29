const News = require('../models/newsLetterModel');

exports.createNewUser = async (req, res) => {
    const newUser = await News.create(req.body)
}