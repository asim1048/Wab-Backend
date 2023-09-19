const mongoose = require('mongoose');

const progressReports = new mongoose.Schema({
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    subTaskID: { type: String, required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    file: { type: String, required: true },
    status: [{
        memberID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        reportAccepted: { type: Boolean },
    }],
    acceptedByEveryOne: { type: Boolean, default: false },
    date: { type: String }
})

mongoose.model('progressReports', progressReports);