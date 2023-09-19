const mongoose = require('mongoose');
const projectComments = mongoose.model('projectComments');
const projects = mongoose.model('projects');
const notificationsController = require('./notificationsController');


exports.addComment = (req, res) => {
    const { projectID, commenter, comment, notificationMessage, notificationType, timeStamp } = req.body

    console.log('received req body: ', req.body);

    const newComment = new projectComments({ projectID, commenter, comment, timeStamp })
    newComment
        .save()
        .then(result => {
            result
                .populate('commenter', { name: 1, dp: 1 })
                .execPopulate((error, populatedResult) => {
                    if (error) res.send({ error: error })
                    else if (populatedResult) {
                        projects.findOne({ _id: projectID })
                            .then(foundResult => {
                                console.log('foundResult: ', foundResult)
                                foundResult.commentsCount = foundResult.commentsCount + 1
                                foundResult
                                    .save()
                                    .then((updatedResult) => {
                                        notificationsController.addNotification(updatedResult.creatorID, commenter, notificationMessage, notificationType, timeStamp)
                                        res.status(200).json({ message: 'Comment Added Successfully!', result });
                                    }).catch(error => {
                                        console.log('addComment found result save catch error: ', error);
                                        res.json({ error: 'Comment Could not be Added!' });
                                    })
                            })
                    }
                })


        }).catch(error => {
            console.log(error);
            res.send({ error: 'Comment Could not be Added!' });
        })
}


exports.deleteComment = (req, res) => {
    const { projectID, commentID } = req.query;
    projectComments.deleteOne({ _id: commentID })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) {
                projects.findOne({ _id: projectID })
                    .then(foundResult => {
                        console.log('foundResult: ', foundResult)
                        foundResult.commentsCount = foundResult.commentsCount - 1
                        foundResult
                            .save()
                            .then(() => {
                                res.status(200).json({ message: 'Comment Deleted Sucessfully!' });
                            }).catch(error => {
                                console.log('deleteComment found result save catch error: ', error);
                                res.json({ error: 'Comment Could not be Deleted!' });
                            })
                    })
            }
            else if (result.deletedCount == 0) res.json({ error: 'Comment Could not be Deleted!' })
        }).catch(error => {
            console.log('deleteComment catch error: ', error)
            res.json({ error: 'Comment Could not be Deleted!' });
        })
}

exports.getSpecificProjectAllComments = (req, res) => {
    const { projectID, skip, limit } = req.query
    projectComments.find({ projectID })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('commenter', { name: 1, dp: 1 })
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

// exports.verifyLike = (req, res) => {
//     const { projectID, liker } = req.query;
//     projectLikes.findOne({ projectID, liker })
//         .then(result => {
//             if (result) res.send({ result: true })
//             else res.send({ result: false })
//         }).catch(error => {
//             console.log('verifyLike catch error: ', error)
//             res.json({ error: 'Project Could Not Be Verified!' });
//         })
// }

