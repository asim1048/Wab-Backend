const mongoose = require('mongoose');
const connections = mongoose.model('connections');
const notificationsController = require('../Controllers/notificationsController')

exports.checkSpecificConnection = (req, res) => {
    const { userOne, userTwo } = req.query
    connections.findOne({ users: { $all: [userOne, userTwo] } })
        .then(result => {
            if (result) {
                console.log('checkSpecificConnection: ', result)
                res.send({ result: 'connected' })
            }
            else res.send({ result: 'not connected' })
        }).catch(error => {
            console.log('checkSpecificConnection catch error: ', error)
            res.send({ error })
        })
}

exports.deleteConnection = (req, res) => {
    const { userOne, userTwo } = req.query
    connections.deleteOne({ users: { $all: [userOne, userTwo] } })
        .then(result => {
            console.log('result', result)
            if (result.deletedCount == 1) res.send({ message: 'deleted' })
            else if (result.deletedCount == 0) res.json({ error: 'connection not found!!' })
        }).catch(error => {
            console.log('deleteConnection catch error: ', error)
            res.send({ error: 'connection could not be deleted!' })
        })
}

//, { users: { $ne: user } }
exports.getSpecificUserConnections = (req, res) => {
    const { user, skip, limit } = req.query
    connections.find({ users: user }, { users: { $elemMatch: { $ne: user } }, conversationID: 1 })
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