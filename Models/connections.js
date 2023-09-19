const mongoose = require('mongoose');

const connections = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }],
    conversationID: { type: mongoose.Schema.Types.ObjectId, ref: 'conversations' }
})

mongoose.model('connections', connections);