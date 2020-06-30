// third party modules
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname,'./.env')});

// local modules
const app = require('./app');

const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD)

const connections = () => {
    mongoose.connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true 
    }).then (() => {
        console.log('Database Connected!')
    })
    app.listen(process.env.PORT, () => {
        console.log(`server started at port ${process.env.PORT}`)
    })
}

connections()

process.on('unhandledRejection', error => {
    console.log('ERROR! SERVER CRASHED')
    console.log(error.message)
    server.close(() => {
        process.exit(1)
    })
})