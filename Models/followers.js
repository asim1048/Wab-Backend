const mongoose = require('mongoose');

const followers = new mongoose.Schema({
    companyID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    followerID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    followStatus: { type: String, default: 'pending' }
})

mongoose.model('followers', followers);