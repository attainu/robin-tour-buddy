const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const Booking = require('./bookingModel');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'user must have a first name']
    },
    lastName: {
        type: String,
        required: [true, 'user must have a last name']
    },
    email: {
        type: String,
        unique: [true, 'Email already exsists!'],
        validate: [validator.isEmail, 'Enter valid email!']
    },
    password: {
        type: String,
        minlength: [8, 'password must be atleast 8 characters'],
        required: [true, 'there must be a passwod']
    },photo: {
        type: String,
        default: 'icon.png'
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: 'Please enter same password'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires:Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    bookedTours: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking'
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// userSchema.virtual('newName').get(function() {
//     return this.firstName + 'S' 
// })

// userSchema.virtual('bookedTours', {
//     ref: 'Booking',
//     foreignField: 'user',
//     localField: '_id'
// });

// userSchema.pre(/^find/, async function(next) {
//     let n = await Booking.find()
//     console.log(n)
//     next()
// })

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12)

    this.confirmPassword = undefined
    next()
})

userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } })
    next()
})

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() - 1000;
    next()
})

userSchema.methods.correctPassword = function (currentPassword, storedPassword) {
    return bcrypt.compare(currentPassword, storedPassword)
}

userSchema.methods.ifpasswordChangedAt = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const time = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        return JWTTimestamp < time 
    }
    return false;
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
    
        return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
};

const User = mongoose.model('User', userSchema)

module.exports = User