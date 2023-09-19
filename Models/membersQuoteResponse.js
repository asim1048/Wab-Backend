const mongoose = require('mongoose');

const membersQuoteResponse = new mongoose.Schema({
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    subTaskID: { type: String, required: true },
    status: [{
        memberID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        quoteID: { type: mongoose.Schema.Types.ObjectId, ref: 'quotes' },
        quoteAccepted: { type: Boolean, default: false },
    }],
})

mongoose.model('membersQuoteResponse', membersQuoteResponse);