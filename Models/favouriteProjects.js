const mongoose = require('mongoose');

const favouriteProjects = new mongoose.Schema({
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: true },
    person: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
})

mongoose.model('favouriteProjects', favouriteProjects);