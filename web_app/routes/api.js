const express = require('express');
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");
const route = express.Router();

var cron = require('node-cron');
 
// Models

const User = require('../models/user.js');
const Assign = require('../models/assignment.js')
const Task = require('../models/task.js')

route.post('/user_login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ username: email }, (err, user) => {
        if (user) {
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    const code = Math.floor(1000 + Math.random() * 9000)
                    let query = {
                        _id: user.id
                    }
                    let data = {};
                    data.verification_code = code
                    User.update(query, data, (err) => {
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'taskmanager254@gmail.com',
                                pass: 'Becalmevans36'
                            }
                        });

                        var mailOptions = {
                            from: 'taskmanager254@gmail.com',
                            to: email,
                            subject: 'Verification Code',
                            text: 'Your login verification code is: ' + code
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                res.send({ success: false, message: 'Network error. Try again later' })
                            } else {
                                res.send({ success: true, user: user })
                            }
                        });

                    })
                } else {
                    res.send({ success: false, message: 'Incorrect Password.' })
                }
            });
        }
        else if (!user) {
            res.send({ success: false, message: 'User not found.' })
        }
    })
});

route.post('/verification_code/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (parseInt(user.verification_code) === parseInt(req.body.code)) {
            res.send({ success: true,user:user })
        }
        else {
            res.send({ success: false, message: 'Incorrect verification code.' })
        }
    })
})

route.get('/assigned_task/:id', (req, res) => {
    Assign.find({ user_id: req.params.id }, (err, tasks) => {
        res.send({ success: true, tasks: tasks })
    })
})

route.get('/progress/:id', (req, res) => {
    Task.findById(req.params.id, (err, task) => {
        let query = {
            _id: req.params.id
        }
        let data = {};
        if (task.status === 'TO DO') {
            data.status = 'IN PROGRESS'
            Assign.update({ "task_id": req.params.id }, { "$set": { "status": "IN PROGRESS" } }, { "multi": true }, (err) => {

            })
        }
        else if (task.status === 'IN PROGRESS') {
            data.status = 'REVIEW'
            Assign.update({ "task_id": req.params.id }, { "$set": { "status": "REVIEW" } }, { "multi": true }, (err) => {

            })
        }
        else if (task.status === 'REVIEW') {
            data.status = 'REVISION'
            Assign.update({ "task_id": req.params.id }, { "$set": { "status": "REVISION" } }, { "multi": true }, (err) => {

            })
        }
        else if (task.status === 'REVISION') {
            data.status = 'COMPLETE'
            Assign.update({ "task_id": req.params.id }, { "$set": { "status": "COMPLETE" } }, { "multi": true }, (err) => {

            })
        }

        Task.update(query, data, (err) => {
            Task.findById(req.params.id, (err, task) => {
                res.send({ success: true, task: task })
            })


        })

    })
})

route.get('/delete_task/:id',(req,res)=>{
    Task.findByIdAndRemove(req.params.id, (err) => {
        Assign.remove({task_id:req.params.id},(err)=>{
          res.send({success:true})
        })
        
    })
})


module.exports = route