const express = require('express');
const router = express.Router();
const messagesController = require('../Controllers/messagesController')

//ROUTES 
router.post('/messages/addMessage', messagesController.addMessage)
router.get('/messages/getSpecificConversationMessages?:conversationID?:skip?:limit', messagesController.getSpecificConversationMessages)
router.delete('/messages/deleteMessages', messagesController.deleteMessages)

module.exports = router;