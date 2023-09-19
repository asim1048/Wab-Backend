const mongoose = require('mongoose');

const projectLikes = new mongoose.Schema({
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: true },
    liker: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
})

mongoose.model('projectLikes', projectLikes);