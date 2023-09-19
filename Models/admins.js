const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const admins = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contactNo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    dp: {
        type: String,
    }
});


admins.pre('save', function (next) {
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


admins.methods.comparePassword = function (candidatePassword) {
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


mongoose.model('admins', admins);