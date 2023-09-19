const mongoose = require('mongoose');
const connectionRequests = mongoose.model('connectionRequests');
const connections = mongoose.model('connections')
const conversations = mongoose.model('conversations')
const notificationsController = require('./notificationsController')


exports.addConnectionRequest = (req, res) => {
    const { requestor, requestee, notificationMessage, notificationType, timeStamp } = req.body
    const addRequest = new connectionRequests({ requestor, requestee, timeStamp })
    addRequest
        .save()
        .then(result => {
            console.log('result: ', result)
            notificationsController.addNotification(requestee, requestor, notificationMessage, notificationType, timeStamp)
            res.status(200).json({ message: 'Request Sent Successfully!' });
        }).catch(error => {
            console.log(error);
            res.json({ error: 'Request Could Not Be Sent!' });
        })
}

const addConnection = (res, requestor, acceptor, conversationID, notificationMessage, notificationType, timeStamp, requestID) => {
    const addConnection = new connections({ users: [requestor, acceptor], conversationID })
    addConnection
        .save()
        .then(result => {
            console.log('result: ', result)
            notificationsController.addNotification(requestor, acceptor, notificationMessage, notificationType, timeStamp)
            connectionRequests.deleteOne({ _id: requestID })
                .then(result => {
                    console.log('result: ', result)
                    if (result.deletedCount == 1) res.send({ message: 'Connection Added Sucessfully!' });
                }).catch(error => {
                    console.log('deleteOne request catch error: ', error)
                    res.json({ error: 'request could not be deleted!!' });
                })
        }).catch(error => {
            console.log('acceptConnectionRequest catch error: ', error)
            res.json({ message: 'request could not be accepted!' });
        })
}

exports.acceptConnectionRequest = (req, res) => {
    const { requestor, acceptor, notificationMessage, notificationType, timeStamp, requestID } = req.body
    let users = [requestor, acceptor]
    conversations.findOne({ users: { $all: [requestor, acceptor] } })
        .then(async result => {
            if (result) {
                addConnection(res, requestor, acceptor, result._id, notificationMessage, notificationType, timeStamp, requestID)
            }
            else if (!result) {
                const conversation = new conversations({ users: [requestor, acceptor] })
                conversation
                    .save()
                    .then(result => {
                        addConnection(res, requestor, acceptor, result._id, notificationMessage, notificationType, timeStamp, requestID)
                    }).catch(error => {
                        console.log('addConversation catch error: ', error)
                        res.send({ error: "Conversation Could Not Be Added!" })
                    })
            }
        }).catch(error => {
            console.log('acceptConnectionRequest catch error: ', error)
            return { error: "Conversation Could Not Be Added!" }
        })

}

exports.rejectConnectionRequest = (req, res) => {
    const { requestID } = req.query
    connectionRequests.deleteOne({ _id: requestID })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) res.send({ message: 'deleted' })
            else if (result.deletedCount == 0) res.json({ error: 'request not found!!' })
        }).catch(error => {
            console.log('deleteOne request catch error: ', error)
            res.send({ error: 'request could not be deleted!!' });
        })
}

exports.getAllSentConnectionRequests = (req, res) => {
    const { requestor, skip, limit } = req.query
    connectionRequests.find({ requestor })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('requestee', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error)
                res.send({ error: "Requests Could Not Be Got!" })
            } else {
                console.log('result: ', result)
                res.send({ result })
            }
        })
}

exports.getAllReceivedConnectionRequests = (req, res) => {
    const { requestee, skip, limit } = req.query
    connectionRequests.find({ requestee })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('requestor', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error)
                res.send({ error: "Requests Could Not Be Got!" })
            } else {
                console.log('result: ', result)
                res.send({ result })
            }
        })
}

exports.cancelConnectionRequest = (req, res) => {
    const { requestID } = req.query
    connectionRequests.deleteOne({ _id: requestID })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) res.send({ message: 'cancelled' })
            else if (result.deletedCount == 0) res.json({ error: 'request not found!!' })
        }).catch(error => {
            console.log('cancelConnectionRequest catch error: ', error)
            res.send({ error: 'request could not be cancelled!!' });
        })
}

// TO CHECK IF REQUEST IS SENT TO A SPECIFIC PERSON OR
// IF REQUEST IS RECEIVED BY THAT PERSON
exports.checkSpecificConnectionRequest = (req, res) => {
    const { requestor, requestee } = req.query
    console.log("requestor: ", requestor)
    console.log("requestee: ", requestee)
    connectionRequests.findOne({ requestor, requestee })
        .then(result => {
            console.log("result: ", result)
            if (result) {
                console.log('checkSpecificConnectionRequest: ', result)
                res.send({ result: 'sent' })
            }
            else {
                console.log('else')
                connectionRequests.findOne({ requestor: requestee, requestee: requestor })
                    .then(result => {
                        if (result) {
                            console.log('checkSpecificConnectionRequest: ', result)
                            res.send({ result: 'received' })
                        }
                        else {
                            res.send({ result: 'neither sent nor received' })
                        }
                    }).catch(error => {
                        console.log('checkSpecificConnectionRequest catch error: ', error)
                        res.send({ error })
                    })
            }
        }).catch(error => {
            console.log('checkSpecificConnectionRequest catch error: ', error)
            res.send({ error })
        })
}