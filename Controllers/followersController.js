const mongoose = require('mongoose');
const users = mongoose.model('users');
const followers = mongoose.model('followers');
const notifications = mongoose.model('notifications');


exports.addFollowRequest = (req, res, next) => {
    const { companyID, followerID, notificationMessage, notificationType, timeStamp } = req.body

    console.log('received req body: ', req.body);

    const addFollower = new followers({
        companyID,
        followerID,
    });
    addFollower
        .save()
        .then(result => {
            console.log('result: ', result)
            const notification = new notifications({
                recipientID: companyID,
                notifierID: followerID,
                notification: notificationMessage,
                type: notificationType,
                timeStamp
            })
            notification
                .save()
                .then(notificationResult => {
                    console.log('notification Result: ', notificationResult)
                })
            res.status(200).json({ message: 'Follow Request Sent!' });
        }).catch(error => {
            if (error.name === 'MongoError' && error.code === 11000) {
                console.log(error.keyValue);
                return res.json({ error: `follower Already Exist!!` });
            }
            console.log(error);
            res.json({ error: 'follower Could not be added!!' });
        })
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

exports.getAllFollowRequests = (req, res) => {
    const { companyID, skip, limit } = req.query
    projects.find({ companyID, followStatus: 'pending' })
        .sort({ _id: -1 })
        .skip(parseInt(skip)).limit(parseInt(limit))
        .populate('followerID', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error)
            } else {
                console.log('result: ', result)
                res.send({ result })
            }
        }).catch(error => {
            console.log(error);
            res.json({ error: 'projects could not be got!!' });
        })
}

exports.addFollower = (req, res, next) => {
    const { companyID, followerID, notificationMessage, notificationType, timeStamp } = req.body

    console.log('received req body: ', req.body);

    const addFollower = new followers({ companyID, followerID, followStatus: 'following' });
    addFollower
        .save()
        .then(result => {
            console.log('result: ', result)
            const notification = new notifications({
                recipientID: companyID,
                notifierID: followerID,
                notification: notificationMessage,
                type: notificationType,
                timeStamp
            })
            notification
                .save()
                .then(notificationResult => {
                    console.log('notification Result: ', notificationResult)
                })
            res.status(200).json({ message: 'Followed Successfully!' });
        }).catch(error => {
            if (error.name === 'MongoError' && error.code === 11000) {
                console.log(error.keyValue);
                return res.json({ error: `follower Already Exist!!` });
            }
            console.log(error);
            res.json({ error: 'follower Could not be added!!' });
        })
}
