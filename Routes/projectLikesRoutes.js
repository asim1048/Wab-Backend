const express = require('express');
const router = express.Router();
const projectLikesController = require('../Controllers/projectLikesController')

//ROUTES 
router.post('/projectLikes/addLike', projectLikesController.addLike)
router.delete('/projectLikes/unlikeProject?:projectID?:liker', projectLikesController.unlikeProject)
router.get('/projectLikes/getSpecificProjectAllLikes?:projectID?:skip?:limit', projectLikesController.getSpecificProjectAllLikes)
router.get('/projectLikes/verifyLike?:projectID?:liker', projectLikesController.verifyLike)

module.exports = router;