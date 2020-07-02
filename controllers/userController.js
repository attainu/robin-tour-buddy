const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const factory = require('./factoryHandler');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (req.files === undefined) {
        return next();
    } else if (req.files.length === 0) {
        return next()
    }
    req.files[0].originalname = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.files[0].buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.files[0].originalname}`);

    next();
});

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
        return next(new AppError('This fields are not allowed, please use /updateMyPassword to update the password!'))
    }
    const filteredFields = filterObj(req.body, 'firstName','lastName','email')
    if (req.files != undefined) filteredFields.photo = req.files[0].originalname;

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