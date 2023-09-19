const express = require('express');
const router = express.Router();
const notificationsController = require('../Controllers/notificationsController')

//ROUTES 
router.get('/notifications/getSpecificUserNotifications?:userID?:skip?:limit', notificationsController.getSpecificUserNotifications)
router.put('/notifications/updateOneNotification', notificationsController.updateOneNotification)
router.post('/notifications/sendNotification', notificationsController.sendNotification)

module.exports = router;