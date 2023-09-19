const mongoose = require('mongoose');

const passwordResetTokensSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    token: { type: String },
    date: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

mongoose.model('passwordResetTokensSchema', passwordResetTokensSchema);