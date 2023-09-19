const express = require('express');
const router = express.Router();
const conversationsController = require('../Controllers/conversationsController')

//ROUTES 
router.get('/conversations/getSpecificUserConversations?:user?:skip?:limit', conversationsController.getSpecificUserConversations)
router.get('/conversations/checkSpecificConversation?:userOne?:userTwo', conversationsController.checkSpecificConversation)
router.get('/conversations/getSpecificConversation?:conversationID?:userID', conversationsController.getSpecificConversation)

module.exports = router;