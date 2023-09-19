const mongoose = require('mongoose');

const projects = new mongoose.Schema({
    creatorID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    creatorAcceptanceStatus: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    images: [],
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    subTasks: [{
        name: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        subCategory: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        public: { type: Boolean, required: true },
        status: { type: String, default: 'notStarted' },
        files: [],
        contractor: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
    }]
});

mongoose.model('projects', projects);