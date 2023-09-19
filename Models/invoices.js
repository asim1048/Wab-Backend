const mongoose = require('mongoose');

const invoices = new mongoose.Schema({
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    subTaskID: { type: String, required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    file: { type: String, required: true },
    status: { type: String, default: 'pending' },
    date: { type: String }
})

mongoose.model('invoices', invoices);