const onlineUsersController = require('../Controllers/onlineUsersController')
const messagesController = require('../Controllers/messagesController')


module.exports = (io) => {

    io.on('connection', socket => {
        console.log("ALHAMDULILLAH")
        console.log(socket.id)

        socket.on('new user', (userInfo) => {
            socket.broadcast.emit('new user info', { userID: userInfo.userID, socketID: socket.id })
            onlineUsersController.addOnlineUser(userInfo.userID, socket.id)
        })

        socket.on('message', (message) => {
            if (message.from) {
                console.log('message.to: ', message.to)
                socket.to(message.to).emit('new message', message.message)
            }
            messagesController.addMessage(
                message.message.messageID,
                message.message.sender,
                message.message.receiver,
                message.message.conversationID,
                message.message.message,
                message.message.type,
                message.message.time,
                message.message.date,
                message.message.timeStamp,
            )
        });

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id)
            onlineUsersController.deleteOfflineUser(socket.id)
        });
    });
};



// {
//     _id: Date.now().toString(),
//     messageID: Date.now().toString(),
//     sender: "61057e7e2712fd300ce6ad54",
//     receiver: partnerInfo._id,
//     conversationID,
//     message: newMessage,
//     type: 'text',
//     time: "8:40 pm",
//     date: "23-08-2021",
//     timeStamp: "23-08-2021 8:40 pm"
// }