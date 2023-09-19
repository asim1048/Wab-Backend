const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs')
const projects = mongoose.model('projects');
// const projects = mongoose.model('projects');

const membersQuoteResponseController = require('../Controllers/membersQuoteResponseController')

exports.addProject = (req, res) => {
    if (req.files) {
        const { creatorID, name, description, city, type, status, teamMembers } = req.body

        console.log(creatorID+' ' +name+' ' +description);

        let parsedTeamMembers = teamMembers ? JSON.parse(teamMembers) : null
        // parsedTeamMembers.unshift(creatorID)
        const addProject = new projects({
            creatorID,
            name,
            description,
            city,
            type,
            status,
            images: req.files.map(image => {
                return `images/projectImages/${image.originalname}`
            }),
            teamMembers: parsedTeamMembers
        });
        addProject
            .save()
            .then(result => {
                console.log('add subtask result: ', result)
                res.status(200).json({ message: 'project saved Successfully!!', result });
            }).catch(error => {
                console.log(error);
                res.json({ error: 'project could not be saved!!' });
            })
    } else {
        console.log(req.files)
        res.send({ error: 'no image found' })
    }
}

exports.addProjectTest = (req, res) => {
    const { name, description, city, type } = req.body;
    console.log('Name ' + req.body.name);
}

exports.getAllProjects = (req, res) => {
    const { userID, skip, limit } = req.query
    projects.find({ status: 'published', teamMembers: { $ne: userID } }, { subTasks: 0, teamMembers: 0 })
        .sort({ _id: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .then(result => result ? res.send({ result }) : res.send({ error: 'No Result Found!!' }))
        .catch(error => {
            console.log(error);
            res.json({ error: 'projects could not be got!!' });
        })
}

// exports.getActiveProjects = (req, res) => {
//     const { skip, limit } = req.query
//     projects.find({ status: 'active' })
//         .sort({ _id: -1 })
//         .skip(parseInt(skip)).limit(parseInt(limit))
//         .then(result => {

//             result ? res.send({ result }) : res.send({ error: 'No Result Found!!' })

//         }).catch(error => {
//             console.log(error);
//             res.json({ error: 'projects could not be got!!' });
//         })
// }

exports.getMyProjects = (req, res) => {
    const { creatorID, skip, limit } = req.query
    projects.find({ creatorID })
        .sort({ _id: -1 })
        .skip(parseInt(skip)).limit(parseInt(limit))
        .populate('teamMembers', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('get my projects error: ', error)
            }
            else if (result) {
                console.log('get my projects result: ', result)
                res.send({ result })
            }
        })
}

// GET FINISHED PROJECTS OF ALL PROJECT CREATORS
exports.getAllFinishedProjects = (req, res) => {
    const { skip, limit } = req.query
    projects.find({ status: 'finished' })
        .sort({ _id: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('creatorID', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('getAllFinishedProjects error: ', error)
            }
            else if (result) {
                console.log('get my projects result: ', result)
                res.send({ result })
            }
        })
}

exports.addSubTask = (req, res) => {
    if (req.files) {
        const { projectID, projectStatus, name, description, category, subCategory, startDate, endDate, public } = req.body;
        projects.findOne({ _id: projectID })
            .then(result => {
                if (result) {
                    result.status = projectStatus
                    result.subTasks.push({
                        name,
                        description,
                        category,
                        subCategory,
                        startDate,
                        endDate,
                        public,
                        files: req.files.map(file => {
                            return `Files/subTasksFiles/${file.originalname}`
                        })
                    })
                    result
                        .save()
                        .then(updatedResult => {
                            console.log('updated result: ', updatedResult)
                            let subTaskID = updatedResult.subTasks[updatedResult.subTasks.length - 1]._id
                            membersQuoteResponseController.addTeamMembers(projectID, subTaskID, result.teamMembers)
                            res.status(200).json({ message: 'Sub Task Added Successfully!!', result: updatedResult });
                        }).catch(error => {
                            console.log('add sub task catch error', error);
                            res.json({ error: 'project could not be saved!!' });
                        })
                }
            }).catch(error => {
                console.log('find project catch error: ', error);
                res.json({ error: 'Sub Task Could not be saved!!' });
            })
    }
    else if (!req.files) {
        console.log(req.files);
        res.send({ error: "Files Not Found!!" })
    }
}

exports.fetchSpecificProject = (req, res) => {
    const { projectID } = req.query
    projects.findOne({ _id: projectID })
        .then(async result => {
            if (result) {
                console.log('result: ', result)

                res.send({ result })
            } else if (!result) {
                res.send({ error: 'No Result Found!!' })
            }
        }).catch(error => {
            console.log(error);
            res.json({ error: 'projects cot found!!' });
        })
}

exports.fetchNotStartedSubTasksOfSpecificProject = (req, res) => {
    const { projectID } = req.query
    let subTasks = { $elemMatch: { $ne: { "subTasks.status": 'notStarted' } } }
    let query = { name: 1, description: 1, city: 1, images: 1, type: 1, teamMembers: 1, subTasks }
    projects.findOne({ _id: projectID }, query)
        .then(result => {
            console.log('result: ', result)
            res.send({ result })
        }).catch(error => {
            console.log('error: ', error)
            res.send({ error: 'SubTasks Not Found!' })
        })
}

exports.deleteOneProject = (req, res) => {
    const { projectID } = req.query;
    projects.deleteOne({ _id: projectID })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) {
                res.json({ message: 'projects deleted successfully!!' });
            } else if (result.deletedCount == 0) {
                res.json({ error: 'project not found!!' });
            }
        }).catch(error => {
            console.log('delete one project catch error: ', error)
            res.json({ message: 'projects could not be deleted!!' });
        })
}

exports.getSpecificCompanyProjects = (req, res) => {
    const { creatorID } = req.query
    console.log(creatorID)
    projects.find({ creatorID }, { images: 1 })
        .then(result => {
            if (result) {
                console.log('getSpecificCompanyProjects: ', result)
                res.send({ result })
            }
        })
        .catch(error => console.log('getSpecificCompanyInfo catch error: ', error))
}

exports.updateProject = (req, res) => {
    const { projectID, creatorID, name, description, city, type, projectImages, teamMembers } = req.body
    let parsedTeamMembers = JSON.parse(teamMembers)
    parsedTeamMembers.unshift(creatorID)
    projects.findOne({ _id: projectID })
        .then(result => {
            console.log('result: ', result)
            result.name = name
            result.description = description
            result.city = city
            result.type = type
            if (req.files) {
                let parsedImages = JSON.parse(projectImages)
                req.files.forEach(image => {
                    parsedImages.push(`images/projectImages/${image.originalname}`)
                })
                result.images = parsedImages
            }
            result.teamMembers = parsedTeamMembers
            result
                .save()
                .then(updatedResult => {
                    console.log('updatedResult', updatedResult)
                    membersQuoteResponseController.updateMembers(projectID, parsedTeamMembers)
                    res.send({ message: 'Project Updated Successfully!', result: updatedResult })
                }).catch(error => {
                    console.log('updateProject: ', error)
                })
        })
}


exports.updateSubTask = (req, res) => {
    const { projectID, subTaskID, name, description, category, subCategory, startDate, endDate, public, subTaskFiles } = req.body
    projects.findOne({ _id: projectID })
        .then(result => {
            result.subTasks.forEach(subTask => {
                if (subTask._id == subTaskID) {
                    subTask.name = name
                    subTask.description = description
                    subTask.category = category
                    subTask.subCategory = subCategory
                    subTask.startDate = startDate
                    subTask.endDate = endDate
                    subTask.public = public
                    if (req.files) {
                        let parsedSubTaskFiles = JSON.parse(subTaskFiles)
                        req.files.forEach(file => {
                            parsedSubTaskFiles.push(`Files/subTasksFiles/${file.originalname}`)
                        })
                        subTask.files = parsedSubTaskFiles
                    }
                }
            })
            result
                .save()
                .then(updatedResult => {
                    console.log('updated Result: ', updatedResult)
                    res.send({ message: 'Sub Task Updated Successfully!', result: updatedResult })
                })
                .catch(error => console.log('save result catch error: ', error))
        })
        .catch(error => console.log('find one subTask catch error: ', error))
}

exports.addContractor = (req, res) => {
    const { projectID, subTaskID, contractor, status } = req.body
    console.log('req body: ', req.body)
    let allSubTasksStarted = true
    projects.findOne({ _id: projectID })
        .then(result => {
            console.log('result: ', result)
            result.subTasks.forEach(subTask => {
                if (subTask.status === 'notStarted') {
                    allSubTasksStarted = false
                }
                if (subTask._id == subTaskID) {
                    console.log('true')
                    subTask.contractor = contractor
                    subTask.status = status
                    subTask.teamMembers.push(contractor)
                }
            })
            if (allSubTasksStarted) {
                console.log('all subtasks has started')
                result.status = 'noSubTaskPending'
            }
            result
                .save()
                .then(updatedResult => {
                    console.log('updatedResult: ', updatedResult)
                    res.send({ message: 'Contractor Added Successfully!' })
                }).catch(error => {
                    console.log('updatedResult catch error: ', error)
                    res.send({ error: 'Contractor Not Added!' })
                })
        }).catch(error => {
            console.log('updatedResult catch error: ', error)
            res.send({ error: 'Contractor Not Added!' })
        })
}


exports.getSpecificStartedProjects = (req, res) => {
    const { contractor, skip, limit } = req.query
    let subTasks = { $elemMatch: { teamMembers: contractor } }
    let query = { name: 1, description: 1, city: 1, images: 1, type: 1, teamMembers: 1, subTasks }
    projects.find({ "subTasks.teamMembers": contractor }, query)
        .sort({ _id: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .then(result => {
            console.log('result: ', result)
            res.send({ result })
        }).catch(error => {
            console.log('error: ', error)
            res.send({ error: 'SubTasks Not Found!' })
        })
}

exports.getSpecificSubTasksOfStartedProject = (req, res) => {
    const { projectID, contractor } = req.query
    let subTasks = { $elemMatch: { teamMembers: contractor } }
    let query = { name: 1, description: 1, city: 1, images: 1, type: 1, teamMembers: 1, subTasks }
    projects.findOne({ _id: projectID }, query)
        .then(result => {
            console.log('result: ', result)
            res.send({ result })
        }).catch(error => {
            console.log('error: ', error)
            res.send({ error: 'SubTasks Not Found!' })
        })
}

exports.addSubTaskTeamMembers = (req, res) => {
    const { projectID, subTaskID, teamMembers } = req.body
    projects.findOne({ _id: projectID })
        .then(result => {
            console.log('result: ', result)
            for (let i = 0; i < result.subTasks.length; i++) {
                if (result.subTasks[i]._id == subTaskID) {
                    teamMembers.unshift(result.subTasks[i].contractor)
                    result.subTasks[i].teamMembers = teamMembers
                    break;
                }
            }
            result
                .save()
                .then(updatedResult => {
                    console.log('updatedResult: ', updatedResult)
                    res.send({ message: 'Team Members Added Successfully!' })
                }).catch(error => {
                    console.log('updatedResult catch error: ', error)
                    res.send({ error: 'Team Members Not Added!' })
                })
        }).catch(error => {
            console.log('updatedResult catch error: ', error)
            res.send({ error: 'Team Members Not Added!' })
        })
}