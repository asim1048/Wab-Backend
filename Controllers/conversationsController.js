const mongoose = require('mongoose');
const conversations = mongoose.model('conversations');
const notificationsController = require('./notificationsController')

exports.getSpecificUserConversations = (req, res) => {
    const { user, skip, limit } = req.query
    conversations.find({ users: user }, { users: { $elemMatch: { $ne: user } }, lastMessage: { $elemMatch: { userID: user } } })
        .populate('users', { name: 1, dp: 1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .exec((error, result) => {
            if (error) {
                console.log('error', error)
                res.send({ errro: 'Contact Not Found!' })
            } else if (result) {
                console.log('result', result)
                res.send({ result })
            }
        })
}

exports.checkSpecificConversation = (req, res) => {
    const { userOne, userTwo } = req.query
    console.log('checkSpecificConversation')
    conversations.findOne({ users: { $all: [userOne, userTwo] } })
        .then(result => {
            if (result) {
                console.log('checkSpecificConversatione result: ', result)
                res.send({ result: result._id })
            } else if (!result) {
                res.send({ message: 'Conversation Not Found!' })
            }
        }).catch(error => {
            console.log('checkSpecificConversation catch error: ', error)
            res.send({ error: 'No Conversation Found!' })
        })
}


exports.getSpecificConversation = (req, res) => {
    const { conversationID, userID } = req.query
    console.log('getSpecificConversation')
    conversations.findOne({ _id: conversationID }, { users: { $elemMatch: { $ne: userID } }, lastMessage: { $elemMatch: { userID } } })
        .populate('users', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error', error)
                res.send({ errro: 'Contact Not Found!' })
            } else if (result) {
                console.log('result', result)
                res.send({ result })
            }
        })
}