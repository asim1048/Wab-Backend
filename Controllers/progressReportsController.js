const mongoose = require('mongoose');
const progressReports = mongoose.model('progressReports');
const progressReportNotes = mongoose.model('progressReportNotes');
const notifications = mongoose.model('notifications');
const projects = mongoose.model('projects');
const notificationsController = require('./notificationsController');


exports.addProgressReport = (req, res, next) => {
    console.log('addProgressReport')
    if (req.file) {
        const { projectID, subTaskID, uploader, date, recipients, notificationMessage, notificationType } = req.body
        let file = req.file.originalname
        const addReport = new progressReports({ projectID, subTaskID, uploader, file, date });
        addReport
            .save()
            .then(result => {
                console.log('result: ', result)
                let parsedRecipients = JSON.parse(recipients)
                let notificationRecipients = []
                parsedRecipients.forEach(recipient => {
                    notificationRecipients.push({
                        recipientID: recipient,
                        notifierID: uploader,
                        notification: notificationMessage,
                        type: notificationType,
                        date
                    })
                })
                notifications.insertMany(notificationRecipients)
                    .then(notificationResult => console.log(notificationResult))
                res.send({ message: 'Progress Report Added Sucessfully!' });
            })
            .catch(error => {
                console.log(error);
                res.json({ error: 'Progress Report Could Not Be Added!' });
            })
    }
}


exports.deleteOneFollowRequest = (req, res) => {
    const { companyID, followerID } = req.query;
    followers.deleteOne({ companyID, followerID })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) {
                notifications.deleteOne({ recipientID: companyID, notifierID: followerID, type: 'follow request' })
                    .then(deletedNotification => {
                        console.log('deletedNotification: ', deletedNotification)
                    })
                res.json({ message: 'Request Cancelled!' });
            } else if (result.deletedCount == 0) {
                res.json({ error: 'Request Could Not Be Cancelled!' });
            }
        }).catch(error => {
            console.log('deleteOneFollowRequest catch error: ', error)
            res.json({ error: 'Request Could Not Be Cancelled!' });
        })
}

exports.getSpecificSubTaskProgressReports = (req, res) => {
    const { subTaskID, skip, limit } = req.query
    console.log('subTaskID', subTaskID)
    progressReports.find({ subTaskID })
        .sort({ _id: -1 })
        .skip(parseInt(skip)).limit(parseInt(limit))
        .populate('uploader', { name: 1, dp: 1 })
        .populate('status.memberID', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error)
            } else {
                console.log('result: ', result)
                res.send({ result })
            }
        })
}

exports.addFollower = (req, res, next) => {
    const { companyID, followerID, notificationMessage, notificationType, timeStamp } = req.body

    console.log('received req body: ', req.body);

    const addFollower = new followers({ companyID, followerID, followStatus: 'following' });
    addFollower
        .save()
        .then(result => {
            console.log('result: ', result)
            const notification = new notifications({
                recipientID: companyID,
                notifierID: followerID,
                notification: notificationMessage,
                type: notificationType,
                timeStamp
            })
            notification
                .save()
                .then(notificationResult => {
                    console.log('notification Result: ', notificationResult)
                })
            res.status(200).json({ message: 'Followed Successfully!' });
        }).catch(error => {
            if (error.name === 'MongoError' && error.code === 11000) {
                console.log(error.keyValue);
                return res.json({ error: `follower Already Exist!!` });
            }
            console.log(error);
            res.json({ error: 'follower Could not be added!!' });
        })
}


exports.addProgressReportNote = (req, res) => {
    const { reportID, noteAddedBy, note, timeStamp } = req.body

    console.log('received req body: ', req.body);

    const newNote = new progressReportNotes({ reportID, noteAddedBy, note, timeStamp })
    newNote
        .save()
        .then(result => {
            if (result) {
                res.send({ message: 'Progress Report Note Added Successfully!', result })
            }
            // result
            // .populate('commenter', { name: 1, dp: 1 })
            // .execPopulate((error, populatedResult) => {
            //     if (error) res.send({ error: error })
            //     else if (populatedResult) {
            //         projects.findOne({ _id: projectID })
            //             .then(foundResult => {
            //                 console.log('foundResult: ', foundResult)
            //                 foundResult.commentsCount = foundResult.commentsCount + 1
            //                 foundResult
            //                     .save()
            //                     .then((updatedResult) => {
            //                         notificationsController.addNotification(updatedResult.creatorID, commenter, notificationMessage, notificationType, timeStamp)
            //                         res.status(200).json({ message: 'Comment Added Successfully!', result });
            //                     }).catch(error => {
            //                         console.log('addComment found result save catch error: ', error);
            //                         res.json({ error: 'Comment Could not be Added!' });
            //                     })
            //             })
            //     }
            // })


        }).catch(error => {
            console.log(error);
            res.send({ error: 'Progress Report Note Could not be Added!' });
        })
}

exports.deleteProgressReportNote = (req, res) => {
    const { noteID } = req.query;
    progressReportNotes.deleteOne({ _id: noteID })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) {
                res.send({ message: 'Note Deleted Sucessfully!' })
            }
            else if (result.deletedCount == 0) res.json({ error: 'Progress Report Note Could not be Deleted!' })
        }).catch(error => {
            console.log('deleteProgressReportNote catch error: ', error)
            res.json({ error: 'Progress Report Note Could not be Deleted!' });
        })
}


exports.getSpecificProgressReportAllNotes = (req, res) => {
    const { reportID, skip, limit } = req.query
    progressReportNotes.find({ reportID })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('noteAddedBy', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error)
            } else {
                console.log('result: ', result)
                res.send({ result })
            }
        })
}

exports.getSpecificProgressReport = (req, res) => {
    const { reportID } = req.query
    progressReports.findOne({ _id: reportID })
        .populate('uploader', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error)
            } else {
                console.log('result: ', result)
                res.send({ result })
            }
        })
}

exports.addProgressReportStatus = (req, res) => {
    const { reportID, projectID, respondedBy, acceptanceStatus, timeStamp } = req.body
    console.log(req.body)
    progressReports.findOne({ _id: reportID })
        .then(result => {
            let index = result.status.findIndex((member) => member.memberID == respondedBy)
            if (index != -1) {
                result.status[index].reportAccepted = acceptanceStatus
            } else {
                result.status.push({ memberID: respondedBy, reportAccepted: acceptanceStatus })
            }
            result
                .save()
                .then(savedResult => {
                    let progressReportStatus = savedResult.status
                    projects.findOne({ _id: projectID })
                        .then(projectResult => {
                            if (projectResult) {
                                let projectTeamMembers = projectResult.teamMembers
                                let everyOneHasAcceptedReport = true
                                // foundPtm = foundProjectTeamMember 
                                let foundPtm = undefined;

                                for (let i = 0; i < projectTeamMembers.length; i++) {
                                    foundPtm = progressReportStatus.find(member => member.memberID.equals(projectTeamMembers[i]))

                                    if (foundPtm && foundPtm.reportAccepted == false) {
                                        foundPtm.reportAccepted
                                        everyOneHasAcceptedReport = false
                                    }

                                    else if (!foundPtm) {
                                        everyOneHasAcceptedReport = false
                                        break
                                    }
                                }

                                if (everyOneHasAcceptedReport) {
                                    savedResult.acceptedByEveryOne = true
                                    savedResult
                                        .save()
                                        .then(savedProgressReport => {
                                            notificationsController.addNotification(
                                                savedResult.uploader,
                                                respondedBy,
                                                'accepted progress report',
                                                'progressReportAccepted',
                                                timeStamp
                                            )
                                            console.log('savedProgressReport result: ', savedProgressReport)
                                            res.send({ message: 'status added', reportAcceptedByEveryOne: true })
                                        }).catch(error => {
                                            console.log('saveProgressReport catch error: ', error)
                                            res.send({ error: 'error' })
                                        })

                                } else if (!everyOneHasAcceptedReport) {
                                    res.send({ message: 'status added', reportAcceptedByEveryOne: false })
                                }

                            }
                        }).catch(error => {
                            console.log('projectResult catch error: ', error)
                            res.send({ error: 'error' })
                        })
                })
        }).catch(error => {
            console.log('addProgressReportStatus save result catch error: ', error)
            res.send({ error: 'error' })
        })
    // .populate('uploader', { name: 1, dp: 1 })
    // .exec((error, result) => {
    //     if (error) {
    //         console.log('error: ', error)
    //     } else {
    //         console.log('result: ', result)

    //         res.send({ result })
    //     }
    // })
}

