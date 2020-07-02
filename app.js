
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const express = require('express');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const viewRoutes = require('./routes/viewRoutes');
const newsLetterRoutes = require('./routes/newsLetterRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const cancelRoutes = require('./routes/cancelRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express()
const upload = multer()

app.use(upload.array());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
app.use(cookieParser());
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(
    hpp({
        whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
        ]
    })
);

app.use(compression())

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/tour', tourRoutes);
app.use('/api/user', userRoutes);
app.use('/api/review', reviewRoutes);
app.use('/newsletter', newsLetterRoutes)
app.use('/api/booking', bookingRoutes);
app.use('/api/cancel', cancelRoutes);
app.use('/', viewRoutes);

app.all('*', (req, res, next) => {
    next (new AppError(`can't find ${req.originalUrl} on this server!`))
})

app.use(globalErrorHandler);

module.exports = app

