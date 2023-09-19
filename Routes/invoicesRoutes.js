const express = require('express');
const router = express.Router();
const invoicesController = require('../Controllers/invoicesController')

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Files/invoices/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadFile = multer({ storage: storage });

//ROUTES 
router.post('/invoices/addInvoice', uploadFile.single('invoice'), invoicesController.addInvoice)
router.get('/invoices/getSpecificSubTaskInvoices?:subTaskID?:skip?:limit', invoicesController.getSpecificSubTaskInvoices)
router.post('/invoices/addInvoiceNote', invoicesController.addInvoiceNote)
router.delete('/invoices/deleteInvoiceNote?:noteID', invoicesController.deleteInvoiceNote)
router.get('/invoices/getSpecificInvoiceAllNotes?:invoiceID?:skip?:limit', invoicesController.getSpecificInvoiceAllNotes)

module.exports = router;