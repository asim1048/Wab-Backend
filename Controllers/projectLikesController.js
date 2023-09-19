const mongoose = require('mongoose');
const projects = mongoose.model('projects');
const projectLikes = mongoose.model('projectLikes');
const notifications = mongoose.model('notifications');
const notificationsController = require('./notificationsController');


exports.addLike = (req, res) => {
    const { projectID, liker, creatorID, notificationMessage, notificationType, date } = req.body

    console.log('received req body: ', req.body);

    const newLike = new projectLikes({ projectID, liker })
    newLike
        .save()
        .then(result => {
            console.log('result: ', result)
            projects.findOne({ _id: projectID })
                .then(foundResult => {
                    console.log('foundResult: ', foundResult)
                    foundResult.likesCount = foundResult.likesCount + 1
                    foundResult
                        .save()
                        .then(() => {
                            notificationsController.addNotification(creatorID, liker, notificationMessage, notificationType, date)
                            res.status(200).json({ message: 'Project Liked!' });
                        }).catch(error => {
                            console.log('addLike found result save catch error: ', error);
                            res.json({ error: 'Project Could not be Liked!' });
                        })
                })
        }).catch(error => {
            console.log(error);
            res.json({ error: 'Project Could not be Liked!' });
        })
}


exports.unlikeProject = (req, res) => {
    const { projectID, liker } = req.query;
    projectLikes.deleteOne({ projectID, liker })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) {
                projects.findOne({ _id: projectID })
                    .then(foundResult => {
                        console.log('foundResult: ', foundResult)
                        foundResult.likesCount = foundResult.likesCount - 1
                        foundResult
                            .save()
                            .then(() => {
                                res.status(200).json({ message: 'Project Unliked!' });
                            }).catch(error => {
                                console.log('unlike project found result save catch error: ', error);
                                res.json({ error: 'Project Could not be Liked!' });
                            })
                    })
            }
            else if (result.deletedCount == 0) res.json({ error: 'Project Could Not Be Unliked!' })
        }).catch(error => {
            console.log('deleteOneFollowRequest catch error: ', error)
            res.json({ error: 'Request Could Not Be Cancelled!' });
        })
}

exports.getSpecificProjectAllLikes = (req, res) => {
    const { projectID, skip, limit } = req.query
    projectLikes.find({ projectID })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('liker', { name: 1, dp: 1 })
        .exec((error, result) => {
            if (error) {
                console.log('error: ', error)
            } else {
                console.log('result: ', result)
                res.send({ result })
            }
        })
}

// THIS API IS USED TO HELP OUT IN VERIFYING EITHER A SPECIFIC 
// PORJECT IS LIKED BY A SPECIFIC PERSON OR NOT SO THAT IT COULD BE 
// DISPLAYED ON THE SCREEN ACCORDINGLY

exports.verifyLike = (req, res) => {
    const { projectID, liker } = req.query;
    projectLikes.findOne({ projectID, liker })
        .then(result => {
            if (result) res.send({ result: true })
            else res.send({ result: false })
        }).catch(error => {
            console.log('verifyLike catch error: ', error)
            res.json({ error: 'Project Could Not Be Verified!' });
        })
}

