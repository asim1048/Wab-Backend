const mongoose = require('mongoose');

const conversations = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }],
    lastMessage: [
        {
            userID: { type: String },
            message: { type: String },
            timeStamp: { type: String },
        }
    ]
})

mongoose.model('conversations', conversations);