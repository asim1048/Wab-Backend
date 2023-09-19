const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const users = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    designation: {
        type: String
    },
    contactNo: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    companyID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    dp: {
        type: String,
    }
});


users.pre('save', function (next) {
    console.log('pre save')
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) {
                return next(error);
            }
            user.password = hash;
            next();
        });
    });
});


users.methods.comparePassword = function (candidatePassword) {
    return new Promise((resolve, reject) => {
        const user = this;
        bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
            if (error) {
                return reject(error)
            }
            if (!isMatch) {
                return reject(error)
            }
            resolve(true);
        });
    });
}


mongoose.model('users', users);