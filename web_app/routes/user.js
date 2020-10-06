const express = require('express');
const route = express.Router();


// Functions

const auth = require('../functions/auth.js');
const dashboard = require('../functions/dashboard.js');
const notification = require('../functions/notifications.js');
const task = require('../functions/tasks.js');

const auth_user = function (req, res, next) {
    if (!req.user) {
      req.flash('info', 'You are logged out, Please Log In')
      res.redirect('/')
    } else {
      next()
    }
}

// Regiser Page

route.get('/register',auth.register_page);
route.post('/add_new_user',auth.add_new_user);

// Login Page

route.get('/',auth.login_page);
route.get('/log_out',auth_user,auth.log_out);

route.post('/login',auth.login_post);


// User Verification:

route.get('/user_verification',auth_user,auth.verification_page);
route.post('/user_verification_post',auth_user,auth.user_verification_post);

// ACCOUNT


// Dashboard:

route.get('/dashboard',auth_user,dashboard.dashboard_page)

// Tasks

route.get('/action_items',auth_user,task.action_items_page);
route.get('/ideas',auth_user,task.ideas_page);
route.get('/backlog',auth_user,task.backlog_page);
route.get('/proceed/:page/:id',auth_user,task.proceed)
route.get('/task_details/:page/:id',auth_user,task.task_details);
route.get('/edit_task/:page/:id/',auth_user,task.edit_task);
route.get('/delete_task/:page/:id',auth_user,task.delete_task);


route.post('/add_new_task/:page',auth_user,task.add_new_task);
route.post('/edit_task_post/:page/:id',auth_user,task.edit_task_post)


// Notifications

route.get('/notifications',auth_user,notification.notifications_page);

module.exports = route