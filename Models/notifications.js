const mongoose = require('mongoose');

const notifications = new mongoose.Schema({
    recipientID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    notifierID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    notification: { type: String },
    type: { type: String },
    status: { type: String, default: 'unread' },
    reference: { type: String },
    timeStamp: { type: String, required: true }
})

mongoose.model('notifications', notifications);