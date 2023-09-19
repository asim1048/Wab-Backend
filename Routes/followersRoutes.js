const express = require('express');
const router = express.Router();
const followersController = require('../Controllers/followersController')

//ROUTES 
router.post('/followers/addFollowRequest', followersController.addFollowRequest)
router.delete('/followers/deleteOneFollowRequest?:companyID?:followerID', followersController.deleteOneFollowRequest)
router.get('/followers/getAllFollowRequests?:companyID?:skip?:limit', followersController.getAllFollowRequests)

router.post('/followers/addFollower', followersController.addFollower)

module.exports = router;