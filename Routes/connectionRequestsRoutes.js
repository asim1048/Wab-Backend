const express = require('express');
const router = express.Router();
const connectionRequestsController = require('../Controllers/connectionRequestsController')

//ROUTES 
router.post('/connectionRequests/addConnectionRequest', connectionRequestsController.addConnectionRequest)
router.post('/connectionRequests/acceptConnectionRequest', connectionRequestsController.acceptConnectionRequest)
router.delete('/connectionRequests/rejectConnectionRequest?:requestID', connectionRequestsController.rejectConnectionRequest)
router.get('/connectionRequests/cancelConnectionRequest?:requestID', connectionRequestsController.cancelConnectionRequest)
router.get('/connectionRequests/getAllSentConnectionRequests?:requestor?:skip?:limit', connectionRequestsController.getAllSentConnectionRequests)
router.get('/connectionRequests/checkSpecificConnectionRequest?:requestor?:requestee', connectionRequestsController.checkSpecificConnectionRequest)
router.get('/connectionRequests/getAllReceivedConnectionRequests?:requestee?:skip?:limit', connectionRequestsController.getAllReceivedConnectionRequests)

module.exports = router;