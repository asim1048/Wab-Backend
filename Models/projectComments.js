const mongoose = require('mongoose');

const projectComments = new mongoose.Schema({
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: true },
    commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    comment: { type: String, required: true },
    timeStamp: { type: String, required: true }
})

mongoose.model('projectComments', projectComments);