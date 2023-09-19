const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = mongoose.model('users');
const passwordResetTokensSchema = mongoose.model('passwordResetTokensSchema')


const { jwtKey } = require('../Keys');

router.post('/signIn', async (req, res) => {
    const { email, password } = req.body
    users.findOne({ email: email.toLowerCase() })
        .then(async user => {
            if (!user) {
                return res.send({ error: "Invalid Credentials" });
            } else if (user) {
                await user.comparePassword(password);
                const token = jwt.sign({ email: user.email.toLowerCase() }, process.env.JWT_KEY);
                user.password = undefined
                res.json({ token, data: user });
            }
        }).catch(error => {
            console.log('login catch error:', error)
            return res.send({ error: "Email or Password is Incorrect" })
        })
});


router.post('/resetPassword', (req, res) => {
    const { email } = req.body
    console.log(email)
    admins.findOne({ email: email.toLowerCase() })
        .then(user => {
            if (!user) {
                console.log('user down not exist')
                return res.send({ error: 'user does not exist!!' })
            } else if (user) {
                let token = "1234"
                const newToken = passwordResetTokensSchema({
                    userID: user._id,
                    token
                })
                newToken.save()
                    .then(result => {
                        console.log('new token:', result)
                        res.send({ token, userID: user._id })
                    }).catch(error => {
                        console.log('save user error:', error)
                    })
            }
        }).catch(error => {
            console.log('find user error:', error)
        })
});

router.post('/savePassword', (req, res) => {
    const { userID, token, newPassword } = req.body
    passwordResetTokensSchema
        .findOne({ userID, token })
        .then(data => {
            if (!data) {
                console.log('.then no data: ', data)
                return res.send({ error: 'your token has been expired' })
            } else if (data) {
                console.log('else if data: ', data)
                data.remove()
                admins.findOne({ _id: userID })
                    .then(user => {
                        user.password = newPassword
                        user
                            .save()
                            .then(result => {
                                if (result) {
                                    console.log('save user result: ', result)
                                    return res.send({ message: 'Password Reset Sucessfully' })
                                } else if (!result) {
                                    console.log('!result: ', result)
                                    return res.send({ error: 'Password Could not be updated' })
                                }
                            }).catch(error => {
                                console.log('save user catch error: ', error)
                                res.send({ error: 'Password Could not be updated' })
                            })
                    })
            }
        }).catch(error => {
            console.log('exec function catch error: ', error)
            return res.send({ error: 'Password Could not be updated' })
        })
})


// router.post('/resetPassword', (req, res) => {
//     console.log(req.body);
//     let role = req.body.actor;
//     let actor = '';
//     // let doctor = mongoose.model('doctor');

//     if (role === "admin") {
//         actor = mongoose.model('admin');
//     } else if (role === "Doctors") {
//         actor = mongoose.model('doctor');
//     } else if (role === 'healthWorker') {
//         actor = mongoose.model('healthWorker');
//     } else if (role === 'researcher') {
//         actor = mongoose.model('researcher');
//     }

//     try {
//         actor.findOne({ userName: req.body.userName.toUpperCase() })
//             .then(user => {
//                 if (user) {
//                     console.log(user);

//                     let password = '';
//                     let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
//                         'abcdefghijklmnopqrstuvwxyz0123456789@#$';

//                     //password generation
//                     for (let i = 1; i <= 8; i++) {
//                         let char = Math.floor(Math.random() * str.length + 1);
//                         password += str.charAt(char)
//                     }

//                     console.log('generated password: ', password);

//                     console.log('user old password: ', user.password);

//                     user.password = password;

//                     console.log('user new password: ', user.password);

//                     user
//                         .save()
//                         .then(user => {
//                             console.log(user);

//                             const subject = 'RESET PASSWORD [Dengue Surveillance]';

//                             const msg = "<strong>ASSALAM-O-ALAIKUM!</strong><br><p>Dear " + user.name + ", You request for"
//                                 + " reset password has been completed successflly. Now you can login into your account "
//                                 + "by using the password: <strong>" + password + "</strong>.<br>Regards.<br>Dengue Surveillance and Data Collection Team.</p> ";

//                             sendMail.sendMail(user.email, msg, subject);

//                             res.json({ message: "your new password has been sent to your registered email address!!" });
//                         }).catch(error => {
//                             console.log(error);
//                         });
//                 }
//                 else {
//                     res.json({ error: "User not found!!" });
//                 }
//             })
//             .catch(error => {
//                 console.log(error);
//             })
//     } catch (error) {
//         console.log(error);
//     }
// });



module.exports = router;