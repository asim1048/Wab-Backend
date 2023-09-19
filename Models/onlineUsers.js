const mongoose = require('mongoose');

const onlineUsers = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    socketID: { type: String }
})

mongoose.model('onlineUsers', onlineUsers);