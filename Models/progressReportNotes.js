const mongoose = require('mongoose');

const progressReportNotes = new mongoose.Schema({
    reportID: { type: mongoose.Schema.Types.ObjectId, ref: 'progressReports' },
    noteAddedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    note: { type: String, required: true },
    timeStamp: { type: String, required: true }
})

mongoose.model('progressReportNotes', progressReportNotes);