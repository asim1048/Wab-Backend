const express = require('express');
const router = express.Router();
const quotesController = require('../Controllers/quotesController')
const multer = require('multer');

const filesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Files/subTasksFiles/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileUpload = multer({ storage: filesStorage });

//ROUTES 
router.post('/quotes/addQuote', fileUpload.single('quoteFile'), quotesController.addQuote)
router.get('/quotes/getSpecificSubTaskQuotes?:subTaskID?:skip?:limit', quotesController.getSpecificSubTaskQuotes)
router.delete('/quotes/deleteOneQuote?:quoteID', quotesController.deleteOneQuote)

module.exports = router;