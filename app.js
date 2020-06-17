
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const express = require('express');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express()

app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(helmet());

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

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/tour', tourRoutes);
app.use('/api/user', userRoutes);
app.use('/api/review', reviewRoutes);

app.all('*', (req, res, next) => {
    next (new AppError(`can't find ${req.originalUrl} on this server!`))
})

app.use(globalErrorHandler);

module.exports = app

