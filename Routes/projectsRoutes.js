const express = require('express');
const router = express.Router();
const projectsController = require('../Controllers/projectsController');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Images/projectImages/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const filesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Files/subTasksFiles/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const filesUpload = multer({ storage: filesStorage });

router.post('/projects/addProject', upload.array("projectImages"), projectsController.addProject);
router.post('/projects/addProjectTest', projectsController.addProjectTest);

router.get('/projects/getAllProjects?:userID?:skip?:limit', projectsController.getAllProjects);
router.get('/projects/getAllFinishedProjects?:skip?:limit', projectsController.getAllFinishedProjects);
// router.get('/projects/getActiveProjects?:skip?:limit', projectsController.getActiveProjects);
router.get('/projects/getMyProjects?:creatorID?:skip?:limit', projectsController.getMyProjects);
router.post('/projects/addSubTask', filesUpload.array("subTaskFiles"), projectsController.addSubTask);
router.get('/projects/fetchSpecificProject?:projectID', projectsController.fetchSpecificProject);
router.get('/projects/deleteOneProject?:projectID', projectsController.deleteOneProject);

router.get('/projects/getSpecificCompanyProjects?:creatorID', projectsController.getSpecificCompanyProjects);
router.put('/projects/updateProject', upload.array("newImages"), projectsController.updateProject);
router.put('/projects/updateSubTask', upload.array("newFiles"), projectsController.updateSubTask);
router.put('/projects/addContractor', projectsController.addContractor);
router.get('/projects/getSpecificStartedProjects?:contractor?:skip?:limit', projectsController.getSpecificStartedProjects);
router.get('/projects/getSpecificSubTasksOfStartedProject?:projectID?:contractor', projectsController.getSpecificSubTasksOfStartedProject);
router.post('/projects/addSubTaskTeamMembers', projectsController.addSubTaskTeamMembers);

router.get('/projects/fetchNotStartedSubTasksOfSpecificProject?:projectID', projectsController.fetchNotStartedSubTasksOfSpecificProject);



module.exports = router;