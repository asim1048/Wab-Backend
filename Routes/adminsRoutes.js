const express = require('express');
const router = express.Router();
const usersController = require('../Controllers/usersController');

const adminsController = require('../Controllers/adminsController');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/adminsDp/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/addAdmin', adminsController.addAdmin);

router.post('/users/addUser', usersController.addUser);
router.put('/users/updateProfile', upload.single("dp"), usersController.updateProfile);
router.get('/findOneUserRecord?:id', usersController.findOneUserRecord);

router.get('/users/getSpecificCompanyAllEmployees?:companyID', usersController.getSpecificCompanyAllEmployees);
router.delete('/users/deleteOneUser?:id', usersController.deleteOneUser);
router.put('/users/updateOneUser?:id', usersController.updateOneUser);

router.get('/company/getSpecificCompanyInfo?:companyID', usersController.getSpecificCompanyInfo);


module.exports = router;