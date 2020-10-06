const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const nodemailer = require("nodemailer");
var cron = require('node-cron');
const MongoStore = require('connect-mongo')(session);

const app = express();

const Assign = require('./models/assignment.js');
const Task = require('./models/task.js');
const User = require('./models/user.js')
const Notification = require('./models/notification.js')

// Functions

const config = require('./config/keys.js')
require('./config/passport')(passport);

// Views

app.set('view engine', 'jade');
app.set('/views', './views');

// Form body-parser

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ encoded: true }));

// Static Files

app.use(express.static('public'));

// DB connection

mongoose.connect(config.Database);
const db = mongoose.connection;
db.once('open', () => {
  console.log('DB is running')
})
db.on('error', (err) => {
  console.log(err)
})

// Connect Flash

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })

}));

// Passport

app.use(passport.initialize());
app.use(passport.session());

// Routes

const api = require('./routes/api.js');
const user = require('./routes/user.js');
app.use('/api', api);
app.use('/', user);


// Time
var date = new Date();
var hour = ('0' + date.getHours()).slice(-2);
var min = ('0' + date.getMinutes()).slice(-2);
var sec = date.getSeconds();
var year = date.getFullYear();
var day = ('0' + date.getDate()).slice(-2);
var month = ('0' + (date.getMonth() + 1)).slice(-2);
var time = hour + ':' + min;
var day = year + "-" + month + "-" + day;
// Notifications
const timer = () => {
 
  let assign_cursor = Assign.find({}).cursor();
  assign_cursor.on('data', (doc) => {
    User.findById(doc.user_id, (err, user) => {
      // Start time
      if (doc.task.start_date === day) {
        if (doc.task.start_time === time) {
          // EMAIL
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'taskmanager254@gmail.com',
              pass: 'Becalmevans36'
            }
          });

          var mailOptions = {
            from: 'taskmanager254@gmail.com',
            to: user.username,
            subject: 'Reminder on starting on your task',
            text: 'Reminder to start your task:\n' +'Title: '+  doc.task.title +'\n'+'Start Date: '+ doc.task.start_date+ '\n'+'Due Date: '+doc.task.due_date+'\n'+'Description: '+doc.task.description
            
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log('Email not sent')
            } else {
              console.log('Email Sent')
            }
          });

          // Notification

          let data = new Notification();
          data.created_on = new Date();
          data.task = doc.task;
          data.user_id = user.id
          data.message = 'Reminder on starting your task';
          data.save(()=>{

          })
        }
      }

      // Due Time
      if (doc.task.due_date === day) {
        if (doc.task.due_time === time) {
   // EMAIL
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'taskmanager254@gmail.com',
                pass: 'Becalmevans36'
              }
            });
  
            var mailOptions = {
              from: 'taskmanager254@gmail.com',
              to: user.username,
              subject: 'Reminder on your due date',
              text: 'Reminder on your due date:\n' +'Title: '+  doc.task.title +'\n'+'Start Date: '+ doc.task.start_date+ '\n'+'Due Date: '+doc.task.due_date+'\n'+'Description: '+doc.task.description
              
            };
  
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log('Email not sent')
              } else {
                console.log('Email Sent')
              }
            });
  
            // Notification
  
            let data = new Notification();
            data.created_on = new Date();
            data.task = doc.task;
            data.user_id = user.id
            data.message = 'Reminder on your due date for task: ' +doc.task.title;
            data.save(()=>{
              
            })
        }
      }
      // Overdue Time
      

    })

  })

 
 
}

cron.schedule('* * * * *', () => {
  timer()
});

// Port

app.listen(process.env.PORT || 5000, () => {
  console.log('running on port 5000')
})
















