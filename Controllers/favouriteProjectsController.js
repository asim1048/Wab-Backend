const mongoose = require('mongoose');
const favouriteProjects = mongoose.model('favouriteProjects');


exports.addFavouriteProject = (req, res) => {
    const { projectID, person } = req.body

    const favouriteProject = new favouriteProjects({ projectID, person })
    favouriteProject
        .save()
        .then(result => {
            console.log('result: ', result)
            res.send({ message: 'Added To Favourites!' })
        }).catch(error => {
            console.log('addFavouriteProject catch error: ', error);
            res.json({ error: 'Project Could not be Added To Favourites!!' });
        })
}


exports.removeFavouriteProject = (req, res) => {
    const { projectID, person } = req.query;
    favouriteProjects.deleteOne({ projectID, person })
        .then(result => {
            console.log('result: ', result)
            if (result.deletedCount == 1) res.json({ message: 'Removed From Favourites!' })
            else if (result.deletedCount == 0) res.json({ error: 'Could Not Be Removed From Favourties!' })
        }).catch(error => {
            console.log('removeFavouriteProject catch error: ', error)
            res.json({ error: 'Could Not Be Removed From Favourties!' });
        })
}

exports.getSpecificPersonFavouriteProjects = (req, res) => {
    const { person, skip, limit } = req.query
    favouriteProjects.find({ person })
        .sort({ _id: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('projectID')
        .exec((error, result) => {
            if (error) {
                console.log('getSpecificPersonFavouriteProjects: ', errro)
                res.send({ error: 'Projects Could Not Be Fetched!' })
            } else {
                console.log(result.length)
                res.send({ result })
            }
        })
}

// THIS API IS USED TO HELP OUT IN VERIFYING EITHER A SPECIFIC 
// PORJECT IS A FAVOURITE PROJECT OF A SPECIFIC PERSON OR NOT 
// SO THAT IT COULD BE DISPLAYED ON THE SCREEN ACCORDINGLY

exports.verifyFavourite = (req, res) => {
    const { projectID, person } = req.query;
    favouriteProjects.findOne({ projectID, person })
        .then(result => {
            if (result) res.send({ result: true })
            else res.send({ result: false })
        }).catch(error => {
            console.log('verifyFavourite catch error: ', error)
            res.json({ error: 'Project Could Not Be Verified!' });
        })
}
