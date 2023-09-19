const express = require('express');
const router = express.Router();
const connectionsController = require('../Controllers/connectionsController')

//ROUTES 
router.delete('/connections/deleteConnection?:userOne?:userTwo', connectionsController.deleteConnection)
router.get('/connections/checkSpecificConnection?:userOne?:userTwo', connectionsController.checkSpecificConnection)
router.get('/connections/getSpecificUserConnections?:user?:skip?:limit', connectionsController.getSpecificUserConnections)

module.exports = router;