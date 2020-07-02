const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Email = require('../utils/email');


const signToken = function (id) {
    return jwt.sign({id: id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true
    }
    res.cookie('jwt', token, cookieOptions)
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role:req.body.role,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(user, url).sendWelcome();
    createSendToken(user, 200, res)
})

exports.login = catchAsync(async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password) {
        return next(new AppError('please enter email and password',400))
    }
    const user = await User.findOne({email: email}).select('+password')
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Credentials'))
    }
    const url = `${req.protocol}://${req.get('host')}/me`;
    createSendToken(user, 200, res)
})

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async(req, res, next) => {
    // Checking for token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if(!token) {
        return next(new AppError('You are not logged in! login'))
    }
    // verifying token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // check if user still exsits
    const freshUser = await User.findById(decoded.id)
    if(!freshUser) {
        return next(new AppError('this user does not exsist', 401))
    }
    // check if user changed password after generating token
    if(freshUser.ifpasswordChangedAt(decoded.iat)) {
        return next(new AppError('password has been changed recently, login again!'))
    }
    req.user = freshUser
    res.locals.user = freshUser
    next()
})

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );
    
            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
    
            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }
    
            // THERE IS A LOGGED IN USER
            req.user = currentUser
            res.locals.user = currentUser;
            return next();
      } catch (err) {
            return next();
      }
    }
    next();
};

exports.restrict = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You are not allowed to perform this action!'))
        }
        next()
    }
}

exports.forgotPassword = catchAsync(async(req, res, next) => {
    // get user based on posted email id
    const user = await User.findOne({ email: req.body.email })
    if(!user) {
        return next(new AppError('This user does not exsist!', 404))
    }
    
    // generate the random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })

    // sending the mail
    const resetURL = `For Browser: ${req.protocol}://${req.get('host')}/reset-password/${resetToken}
                      For API: ${req.protocol}://${req.get('host')}/user/reset-password/${resetToken}`
    const message = `If you forgot your password, please use a patch request with your new password and password confirm to ${resetURL} \nif not kindly ignore the message!`
    try{
        await new Email(user, resetURL).sendPasswordReset();
        res.status(200).json({
            status: 'success',
            message: 'successfully sent!'
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })
        console.log(err.message, err.stack)
        res.status(500).json({
            status: 'fail',
            message: 'something went wrong'
        })
    }
})

exports.resetPassword = catchAsync(async(req, res, next) => {
    // get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } }).select('+password')
    // check if token is not expired and user exsists, set new password
    if(!user) {
        return next(new AppError('invalid or expired token!', 400))
    }
    const check = await user.correctPassword(req.body.password, user.password)
    if (check) {
        return next(new AppError('Please use a password not used before!'))
    }
    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    // login the user via JWT
    createSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async(req, res, next) => {
    // Get user from the collection
    const user = await User.findOne({ _id: req.user._id }).select('+password')

    if(!user) {
        return next(new AppError('No user found, kindly login!'))
    }
    // check if posted current password is correct
    const postedPrevious = req.body.oldPassword;
    const postedPassword = req.body.password;
    const postedConfrimPassword = req.body.confirmPassword;

    const check = await user.correctPassword(postedPrevious, user.password)

    if(!check) {
        return next(new AppError('Invalid old password entered kindly check!'))
    }
    // if so, update the password
    user.password = postedPassword
    user.confirmPassword = postedConfrimPassword
    await user.save()
    // login the user
    createSendToken(user, 200, res)
})