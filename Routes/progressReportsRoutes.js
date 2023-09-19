const express = require('express');
const router = express.Router();
const progressReportsController = require('../Controllers/progressReportsController')

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Files/progressReports/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadFile = multer({ storage: storage });

//ROUTES 
router.post('/progressReports/addProgressReport', uploadFile.single('progressReport'), progressReportsController.addProgressReport)
router.get('/progressReports/getSpecificSubTaskProgressReports?:subTaskID?:skip?:limit', progressReportsController.getSpecificSubTaskProgressReports)
router.post('/progressReports/addProgressReportNote', progressReportsController.addProgressReportNote)
router.delete('/progressReports/deleteProgressReportNote?:noteID', progressReportsController.deleteProgressReportNote)
router.get('/progressReports/getSpecificProgressReportAllNotes?:reportID?:skip?:limit', progressReportsController.getSpecificProgressReportAllNotes)
router.get('/progressReports/getSpecificProgressReport?:reportID', progressReportsController.getSpecificProgressReport)
router.post('/progressReports/addProgressReportStatus', progressReportsController.addProgressReportStatus)


module.exports = router;