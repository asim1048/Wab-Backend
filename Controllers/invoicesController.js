const mongoose = require('mongoose');
const invoices = mongoose.model('invoices');
const invoiceNotes = mongoose.model('invoiceNotes');
const notifications = mongoose.model('notifications');


exports.addInvoice = (req, res, next) => {
    if (req.file) {
        const { projectID, subTaskID, uploader, date, recipients, notificationMessage, notificationType } = req.body
        let file = req.file.originalname
        const addInvoice = new invoices({ projectID, subTaskID, uploader, file, date });
        addInvoice
            .save()
            .then(result => {
                console.log('result: ', result)
                let parsedRecipients = JSON.parse(recipients)
                let notificationRecipients = []
                parsedRecipients.forEach(recipient => {
                    notificationRecipients.push({
                        recipientID: recipient,
                        notifierID: uploader,
                        notification: notificationMessage,
                        type: notificationType,
                        date
                    })
                })
                notifications.insertMany(notificationRecipients)
                    .then(notificationResult => console.log(notificationResult))
                res.status(200).json({ message: 'Invoice Added Sucessfully!' });
            }).catch(error => {
                console.log(error);
                res.json({ error: 'Invoice Could Not Be Added!' });
            })
    }
}


exports.deleteOneFollowRequest = (req, res) => {
    const { companyID, followerID } = req.query;
    followers.deleteOne({ companyID, followerID })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) {
                notifications.deleteOne({ recipientID: companyID, notifierID: followerID, type: 'follow request' })
                    .then(deletedNotification => {
                        console.log('deletedNotification: ', deletedNotification)
                    })
                res.json({ message: 'Request Cancelled!' });
            } else if (result.deletedCount == 0) {
                res.json({ error: 'Request Could Not Be Cancelled!' });
            }
        }).catch(error => {
            console.log('deleteOneFollowRequest catch error: ', error)
            res.json({ error: 'Request Could Not Be Cancelled!' });
        })
}

exports.getSpecificSubTaskInvoices = (req, res) => {
    const { subTaskID, skip, limit } = req.query
    console.log('subTaskID', subTaskID)
    invoices.find({ subTaskID })
        .sort({ _id: -1 })
        .skip(parseInt(skip)).limit(parseInt(limit))
        .populate('uploader', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error)
            } else {
                console.log('result: ', result)
                res.send({ result })
            }
        })
}


exports.addInvoiceNote = (req, res) => {
    const { invoiceID, noteAddedBy, note, timeStamp } = req.body

    console.log('received req body: ', req.body);

    const newNote = new invoiceNotes({ invoiceID, noteAddedBy, note, timeStamp })
    newNote
        .save()
        .then(result => {
            if (result) {
                res.send({ message: 'Inovice Note Added Successfully!', result })
            }
            // result
            // .populate('commenter', { name: 1, dp: 1 })
            // .execPopulate((error, populatedResult) => {
            //     if (error) res.send({ error: error })
            //     else if (populatedResult) {
            //         projects.findOne({ _id: projectID })
            //             .then(foundResult => {
            //                 console.log('foundResult: ', foundResult)
            //                 foundResult.commentsCount = foundResult.commentsCount + 1
            //                 foundResult
            //                     .save()
            //                     .then((updatedResult) => {
            //                         notificationsController.addNotification(updatedResult.creatorID, commenter, notificationMessage, notificationType, timeStamp)
            //                         res.status(200).json({ message: 'Comment Added Successfully!', result });
            //                     }).catch(error => {
            //                         console.log('addComment found result save catch error: ', error);
            //                         res.json({ error: 'Comment Could not be Added!' });
            //                     })
            //             })
            //     }
            // })


        }).catch(error => {
            console.log(error);
            res.send({ error: 'Invoice Note Could not be Added!' });
        })
}

exports.deleteInvoiceNote = (req, res) => {
    const { noteID } = req.query;
    invoiceNotes.deleteOne({ _id: noteID })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) {
                res.send({ message: 'Note Deleted Sucessfully!' })
            }
            else if (result.deletedCount == 0) res.json({ error: 'Invoice Note Could not be Deleted!' })
        }).catch(error => {
            console.log('deleteInvoiceNote catch error: ', error)
            res.json({ error: 'Invoice Note Could not be Deleted!' });
        })
}


exports.getSpecificInvoiceAllNotes = (req, res) => {
    const { invoiceID, skip, limit } = req.query
    invoiceNotes.find({ invoiceID })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('noteAddedBy', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error)
            } else {
                console.log('result: ', result)
                res.send({ result })
            }
        })
}

