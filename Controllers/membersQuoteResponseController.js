const { ReplSet } = require('mongodb');
const mongoose = require('mongoose');
const membersQuoteResponse = mongoose.model('membersQuoteResponse');
const projects = mongoose.model('projects');


exports.addTeamMembers = (projectID, subTaskID, teamMembers) => {
    let status = teamMembers.map(member => Object.assign({ memberID: member }))
    const addTeamMembers = new membersQuoteResponse({ projectID, subTaskID, status })
    addTeamMembers
        .save()
        .then(result => console.log('addTeamMembers result: ', result))
        .catch(error => console.log('addTeamMembers catch error: ', error))
}

exports.updateMembers = (projectID, newTeamMembers) => {
    membersQuoteResponse.find({ projectID })
        .then(result => {
            if (result) {
                let newStatus = []
                result.forEach(async response => {
                    newTeamMembers.forEach(member => {
                        let requiredMember = response.status.find(item => item.memberID === member)
                        if (requiredMember) {
                            newStatus.push({ memberID: member, quoteAccecpted: requiredMember.quoteAccecpted })
                        } else {
                            newStatus.push({ memberID: member })
                        }
                    })
                    response.status = newStatus
                    await response.save()
                })
            }
        })
        .then(updatedResult => console.log('updateMembers: ', updatedResult))
        .catch(error => console.log('updateMembers catch error: ', error))
}