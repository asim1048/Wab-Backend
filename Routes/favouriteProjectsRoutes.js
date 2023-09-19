const express = require('express');
const router = express.Router();
const favouriteProjectsController = require('../Controllers/favouriteProjectsController')

//ROUTES 
router.post('/favouriteProjects/addFavouriteProject', favouriteProjectsController.addFavouriteProject)
router.delete('/favouriteProjects/removeFavouriteProject?:projectID?:person', favouriteProjectsController.removeFavouriteProject)
router.get('/favouriteProjects/getSpecificPersonFavouriteProjects?:person?:skip?:limit', favouriteProjectsController.getSpecificPersonFavouriteProjects)
router.get('/favouriteProjects/verifyFavourite?:projectID?:person?', favouriteProjectsController.verifyFavourite)

module.exports = router;