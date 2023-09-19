const mongoose = require('mongoose');
const messages = mongoose.model('messages');
const conversations = mongoose.model('conversations');
const notificationsController = require('./notificationsController')

const saveMessage = (messageID, sender, receiver, conversationID, message, type, time, date, timeStamp) => {
    const newMessage = new messages({
        messageID,
        sender,
        receiver,
        conversationID,
        message,
        type,
        time,
        date,
        timeStamp
    })
    newMessage
        .save()
        .then(() => {
            conversations.findOne({ _id: conversationID })
                .then(result => {
                    if (result.lastMessage.length > 1) {
                        result.lastMessage[0].message = type === 'text' ? message.text : 'project'
                        result.lastMessage[0].timeStamp = timeStamp
                        result.lastMessage[1].message = type === 'text' ? message.text : 'project'
                        result.lastMessage[1].timeStamp = timeStamp
                    } else {
                        result.lastMessage.push({
                            userID: sender,
                            message: type === 'text' ? message.text : 'project',
                            timeStamp
                        })
                        result.lastMessage.push({
                            userID: receiver,
                            message: type === 'text' ? message.text : 'project',
                            timeStamp
                        })
                    }
                    result
                        .save()
                        .then(newResult => {
                            console.log('newResult: ', newResult)
                        }).catch(error => {
                            console.log('conversations.findOne result.save catch error: ', error)
                        })
                }).catch(error => {
                    console.log('conversations.findOne catch error: ', error)
                })
        }).catch(error => {
            console.log('saveMessage catch error: ', error)
        })
}

exports.addMessage = (messageID, sender, receiver, conversationID, message, type, time, date, timeStamp) => {
    if (conversationID) {
        saveMessage(messageID, sender, receiver, conversationID, message, type, time, date, timeStamp)
    }
    else if (!conversationID) {
        console.log('if not conversationID addMessage')
        conversations.findOne({ users: { $all: [sender, receiver] } })
            .then(result => {
                if (result) {
                    console.log('conversations.findOne if result: ', result)
                    saveMessage(messageID, sender, receiver, result._id, message, type, time, date, timeStamp)
                    // res.send({ message: 'done' })
                } else if (!result) {
                    console.log('conversations.findOne if not result: ', result)
                    const conversation = new conversations({ users: [sender, receiver] })
                    conversation
                        .save()
                        .then(result => {
                            // console.log(result)
                            saveMessage(messageID, sender, receiver, result._id, message, type, time, date, timeStamp)
                            // res.send({ message: 'done' })
                        }).catch(error => {
                            console.log(error)
                            // res.send({ error: 'failed' })
                        })
                }
            }).catch(error => {
                console.log('conversations.findOne catch error: ', error)
                // res.send({ error: 'failed' })
            })
    }
}

const specificConversationMessages = (res, conversationID, skip, limit) => {
    messages.find({ conversationID })
        .sort({ _id: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .then(result => {
            console.log(result.length)
            res.send({ result })
        }).catch(error => {
            console.log('getSpecificConversationMessages catch error: ', error)
            res.send({ error: 'Messages Not Found!' })
        })
}

exports.getSpecificConversationMessages = (req, res) => {
    const { conversationID, skip, limit } = req.query
    specificConversationMessages(res, conversationID, skip, limit)
}

exports.deleteMessages = (req, res) => {
    const { messageIDs, conversationID, personID } = req.body
    // console.log(messageIDs)
    messages.find({ conversationID })
        .sort({ _id: -1 })
        .then(result => {
            if (result.length > 0) {
                // console.log('deleteMessages messages.find result: ', result)
                result.forEach(async message => {
                    if (messageIDs.includes(message.messageID)) {
                        if (message.deleteFor) {
                            await messages.deleteOne({ messageID: message.messageID })
                        }
                        else {
                            message.deleteFor = personID
                            await message.save()
                        }
                    }
                })
                messages.findOne({ conversationID, deleteFor: { $elemMatch: { $ne: personID } } })
                    .sort({ _id: -1 })
                    .then(message => {
                        console.log('find message after delete result: ', message)
                        if (result) {
                            conversations.findOne({ conversationID })
                                .then((conversationResult) => {
                                    if (conversationResult) {
                                        console.log('conversationResult: ', conversationResult)
                                        let person = conversationResult.lastMessage.find(conversation => {
                                            conversation.userID == personID
                                        })
                                        if (person) {
                                            person.message = message.type === 'text' ? message.message.text : 'project'
                                        }
                                    }
                                    conversationResult
                                        .save()
                                        .then(updatedResult => {
                                            console.log('updatedResult: ', updatedResult)
                                            res.send({ message: 'Message Deleted Sucessfully!' })
                                        }).catch(error => {
                                            console.log('updatedResult catch error: ', error)
                                            res.send({ error: 'Messages Could Not Be Deleted!' })
                                        })
                                })
                        }
                    })
            } else {
                res.send({ error: 'Message Not Found!' })
            }
        }).catch(error => {
            console.log('deleteMessages message.find catch error: ', error)
            res.send({ error: 'Messages Not Found!' })
        })
}

