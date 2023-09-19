const mongoose = require('mongoose');
const onlineUsers = mongoose.model('onlineUsers');

exports.addOnlineUser = (user, socketID) => {
    const newOnlineUser = new onlineUsers({
        user,
        socketID
    })
    newOnlineUser
        .save()
        .then(result => {
            console.log('saveMessage:', result)
        }).catch(error => {
            console.log('saveMessage catch error: ', error)
        })
}

exports.deleteOfflineUser = (socketID) => {
    onlineUsers.deleteOne({ socketID })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) console.log('offline user deleted')
            else if (result.deletedCount == 0) console.log('offline user not deleted')
        }).catch(error => {
            console.log('deleteOne request catch error: ', error)
        })
}

exports.getSpecificUserSocketID = (req, res) => {
    const { user } = req.query
    onlineUsers.findOne({ user })
        .then(result => {
            console.log('getSpecificUserSocketID result: ', result)
            if (result) res.send({ found: true, socketID: result.socketID })
            else res.send({ found: false })
        }).catch(error => {
            console.log('deleteOne request catch error: ', error)
            res.send({ error: 'Socket Id Not Found!' })
        })
}

