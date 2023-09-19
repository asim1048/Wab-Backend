const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server)
require('dotenv').config()
const mongoose = require('mongoose');
const Connection = require('./Database/db.js');
app.use('/Images', express.static('Images'))
app.use('/Files', express.static('Files'))

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*',);
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/', (req, res) => {
    res.send({ message: 'ALHAMDULILLAH' });
});


// DATABASE CONNECTION   to s
Connection().then(() => {
    // Your code here
  }).catch((error) => {
    console.log('Error while connecting to the database:', error.message);
});
// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// });

// const db = mongoose.connection

// db.once('open', _ => {
//     console.log('Database connected:', process.env.MONGO_URL)
// })

// db.on('error', err => {
//     console.error('connection error:', process.env.MONGO_URL)
// })


// MODELS
require('./Models/admins');
require('./Models/users');
require('./Models/passwordResetTokens')
require('./Models/projects')
require('./Models/followers')
require('./Models/notifications')
require('./Models/quotes')
require('./Models/membersQuoteResponse')
require('./Models/progressReports')
require('./Models/invoices')
require('./Models/projectLikes')
require('./Models/favouriteProjects')
require('./Models/projectComments')
require('./Models/connections')
require('./Models/connectionRequests')
require('./Models/messages')
require('./Models/conversations')
require('./Models/onlineUsers')
require('./Models/invoiceNotes')
require('./Models/progressReportNotes')

// ROUTES IMPORTS
const adminsRoutes = require('./Routes/adminsRoutes');
app.use(adminsRoutes);

const authRoutes = require('./Routes/authRoutes');
app.use(authRoutes)

const projectsRoutes = require('./Routes/projectsRoutes');
app.use(projectsRoutes)

const followersRoutes = require('./Routes/followersRoutes');
app.use(followersRoutes)

const notificationsRoutes = require('./Routes/notificationsRoutes');
app.use(notificationsRoutes)

const quotesRoutes = require('./Routes/quotesRoutes');
app.use(quotesRoutes)

const progressReportsRoutes = require('./Routes/progressReportsRoutes');
app.use(progressReportsRoutes)

const invoicesRoutes = require('./Routes/invoicesRoutes');
app.use(invoicesRoutes)

const projectLikesRoutes = require('./Routes/projectLikesRoutes');
app.use(projectLikesRoutes)

const favouriteProjectsRoutes = require('./Routes/favouriteProjectsRoutes');
app.use(favouriteProjectsRoutes)

const projectCommentsRoutes = require('./Routes/projectCommentsRoutes');
app.use(projectCommentsRoutes)

const connectionsRoutes = require('./Routes/connectionsRoutes');
app.use(connectionsRoutes)

const connectionRequestsRoutes = require('./Routes/connectionRequestsRoutes');
app.use(connectionRequestsRoutes)

const messagesRoutes = require('./Routes/messagesRoutes');
app.use(messagesRoutes)

const conversationsRoutes = require('./Routes/conversationsRoutes');
app.use(conversationsRoutes)

const onlineUsersRoutes = require('./Routes/onlineUsersRoutes');
app.use(onlineUsersRoutes)

// SOCKET.IO MODULE
require('./Socket/chatController')(io);

//START SERVER
server.listen(process.env.PORT, () => {
    console.log(`Server Connected at port: ${process.env.PORT}`);
});


