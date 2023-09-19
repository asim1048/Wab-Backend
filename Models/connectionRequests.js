const mongoose = require('mongoose');

const connectionRequests = new mongoose.Schema({
    requestor: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    requestee: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    status: { type: String, default: 'pending' },
    timeStamp: { type: String }
})

mongoose.model('connectionRequests', connectionRequests);