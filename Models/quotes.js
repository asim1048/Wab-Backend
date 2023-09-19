const mongoose = require('mongoose');

const quotes = new mongoose.Schema({
    subTaskID: { type: String, required: true },
    bidderID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    file: { type: String, required: true },
    quoteStatus: { type: String, default: "accepted" },
    date: { type: String }
})

mongoose.model('quotes', quotes);