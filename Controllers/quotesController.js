const mongoose = require('mongoose');
const quotes = mongoose.model('quotes');


exports.addQuote = (req, res) => {
    const { subTaskID, bidderID, date } = req.body
    if (req.file) {
        let file = req.file.originalname
        const addQuote = new quotes({ subTaskID, bidderID, file, date })
        addQuote
            .save()
            .then(result => {
                console.log('result: ', result)
                res.status(200).json({ message: 'Quote Added Successfully!' });
            }).catch(error => {
                console.log(error);
                res.json({ error: 'Quote Could Not Be Added!' });
            })
    }

}

exports.getSpecificSubTaskQuotes = (req, res) => {
    const { subTaskID, skip, limit } = req.query
    quotes.find({ subTaskID })
        .sort({ _id: -1 })
        .skip(parseInt(skip)).limit(parseInt(limit))
        .populate('bidderID', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error)
            } else {
                console.log('result: ', result)
                res.send({ result })
            }
        })
}

exports.deleteOneQuote = (req, res) => {
    const { quoteID } = req.query;
    quotes.deleteOne({ _id: quoteID })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) res.json({ message: 'quote deleted successfully!!' })
            else if (result.deletedCount == 0) res.json({ error: 'quote not found!!' })
        }).catch(error => {
            console.log('delete one quote catch error: ', error)
            res.json({ message: 'quote could not be deleted!!' });
        })
}


// exports.deleteOneFollowRequest = (req, res) => {
//     const { companyID, followerID } = req.query;
//     followers.deleteOne({ companyID, followerID })
//         .then(result => {
//             console.log('result: ', result)
//             if (result.deletedCount == 1) {
//                 notifications.deleteOne({ recipientID: companyID, notifierID: followerID, type: 'follow request' })
//                     .then(deletedNotification => {
//                         console.log('deletedNotification: ', deletedNotification)
//                     })
//                 res.json({ message: 'Request Cancelled!' });
//             } else if (result.deletedCount == 0) {
//                 res.json({ error: 'Request Could Not Be Cancelled!' });
//             }
//         }).catch(error => {
//             console.log('deleteOneFollowRequest catch error: ', error)
//             res.json({ error: 'Request Could Not Be Cancelled!' });
//         })
// }
