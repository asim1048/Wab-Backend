const mongoose = require('mongoose');

const messages = new mongoose.Schema({
    messageID: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    conversationID: { type: mongoose.Schema.Types.ObjectId, ref: 'conversations', required: true },
    message: {
        text: { type: String },
        projectID: { type: String },
        projectName: { type: String },
        projectType: { type: String },
        projectCity: { type: String },
        projectImage: { type: String },
        projectDescription: { type: String },
    },
    type: { type: String },
    time: { type: String },
    date: { type: String },
    timeStamp: { type: String },
    deleteFor: { type: String },

})

mongoose.model('messages', messages);