const mongoose = require('mongoose');

const cancelSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour'
    }
})

const Cancel = mongoose.model('Cancel', cancelSchema)

module.exports = Cancel