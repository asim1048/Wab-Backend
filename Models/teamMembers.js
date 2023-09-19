const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const teamMembers = new mongoose.Schema({
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

mongoose.model('teamMembers', teamMembers);