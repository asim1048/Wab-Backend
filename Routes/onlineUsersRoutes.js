const express = require('express');
const router = express.Router();
const onlineUsersController = require('../Controllers/onlineUsersController')

//ROUTES 
router.get('/onlineUsers/getSpecificUserSocketID?:user', onlineUsersController.getSpecificUserSocketID)

module.exports = router;