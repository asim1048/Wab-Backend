const mongoose = require('mongoose');

const invoiceNotes = new mongoose.Schema({
    invoiceID: { type: mongoose.Schema.Types.ObjectId, ref: 'invoices' },
    noteAddedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    note: { type: String, required: true },
    timeStamp: { type: String, required: true }
})

mongoose.model('invoiceNotes', invoiceNotes);