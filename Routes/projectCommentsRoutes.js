const express = require('express');
const router = express.Router();
const projectCommentsController = require('../Controllers/projectCommentsController')

//ROUTES 
router.post('/projectComments/addComment', projectCommentsController.addComment)
router.delete('/projectComments/deleteComment?:projectID?:commentID', projectCommentsController.deleteComment)
router.get('/projectComments/getSpecificProjectAllComments?:projectID?:skip?:limit', projectCommentsController.getSpecificProjectAllComments)

module.exports = router;