const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const factory = require('./factoryHandler');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) {
            newObj[el] = obj[el]
        }
    })
    return newObj
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

exports.updateMe = catchAsync(async(req, res, next) => {
    if(req.body.password || req.body.confirmPassword) {
        return next(new AppError('This fields are not allowed, please use /updatePassword to update the password!'))
    }
    const filteredFields = filterObj(req.body, 'name','email')
    const user = await User.findByIdAndUpdate(req.user.id, filteredFields, {
        new: true,
        runValidators: true
    })
    if(!user) {
        return next(new AppError('Something went wrong!', 500))
    }
    res.status(200).json({
        status: 'success',
        message: 'successfully updated data!'
    })
})

exports.deleteMe = catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { active: false });
    if(!user) {
        return next(new AppError('Invalid Id!', 400))
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);