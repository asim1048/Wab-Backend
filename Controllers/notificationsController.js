const mongoose = require('mongoose');
const users = mongoose.model('users');
const followers = mongoose.model('followers');
const notifications = mongoose.model('notifications');

// THIS IS THE API TO SEND NOTIFICATIONS
exports.sendNotification = (req, res) => {
    const { recipientID, notifierID, notification, type, reference, timeStamp } = req.body
    const newNotification = new notifications({ recipientID, notifierID, notification, type, reference, timeStamp })
    newNotification
        .save()
        .then(result => {
            console.log('sendNotification result', result)
            res.send({ message: 'Notification Sent Successfully!' })
        }).catch(error => {
            console.log('sendNotification catch error: ', error)
            res.send({ error: 'Notification Could Not Be Sent!' })
        })
}


// THIS FUNCTION IS TO CALL FROM OTHER FUNCTIONS TO SEND NOTIFICATIONS
exports.addNotification = (recipientID, notifierID, notification, type, timeStamp) => {
    const newNotification = new notifications({ recipientID, notifierID, notification, type, timeStamp })
    newNotification
        .save()
        .then(result => console.log('notification Result: ', result))
}

exports.getSpecificUserNotifications = (req, res, next) => {
    const { userID, skip, limit } = req.query

    console.log('req query: ', req.query);

    notifications
        .find({ recipientID: userID })
        .sort({ _id: -1 })
        .skip(parseInt(skip)).limit(parseInt(limit))
        .populate('notifierID', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error)
            } else {
                console.log('result: ', result)
                res.send({ result })
            }
        })
}

exports.updateOneNotification = (req, res) => {
    notifications.findOne({ _id: req.body.notificationID })
        .then(notification => {
            notification.status = req.body.status
            notification
                .save()
                .then(result => {
                    console.log('results: ', result)
                    res.status(200).json({ message: 'Successfull!' });
                }).catch(error => {
                    console.log(error);
                    res.status(200).json({ error: 'notification Could Not Be Updated!!' });
                })
        }).catch(error => {
            console.log(error);
            res.send({ error });
        })
}

