// Libraries

const passport = require('passport');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");


// Models

const User = require('../models/user.js');



// User Registration:

const register_page = (req, res) => {
    res.render('./auth/register.jade')
}

const add_new_user = (req, res) => {
    const { first_name, last_name, user_name, password, password2 } = req.body;
    User.findOne({ first_name: first_name, last_name: last_name, user_name: user_name }, (err, exist) => {
        if (exist) {
            req.flash('danger', 'User already exists.');
            res.redirect('/register');
        }
        else {
            if (password !== password2) {
                req.flash('danger', 'Passwords do not match.');
                res.redirect('/register');
            }
            else {
                let data = new User();
                data.first_name = first_name;
                data.last_name = last_name;
                data.username = user_name;
                data.user_image = 'img/user.png';
                data.verification_code = 0;
                data.password = password;
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        data.password = hash
                        data.save(() => {
                            req.flash('info', 'Registered successfully. Please login.')
                            res.redirect('/')
                        })
                    })
                });
            }
        }
    })
}

// Display login page:

const login_page = (req, res) => {

    res.render('./auth/login.jade')

}

// User login post method:

const login_post = (req, res, next) => {
    passport.authenticate('User', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            req.flash('danger', info.message)
            res.redirect('/');
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            if (user) {
                const code = Math.floor(1000 + Math.random() * 9000)
                let query = {
                    _id: req.user.id
                };
                let data = {};
                data.verification_code = code;
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
                        to: req.user.username,
                        subject: 'Verification Code',
                        text: 'Your login verification code is: ' + code
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            req.flash('danger', 'Server error. Please try again.')
                            console.log(error)
                            res.redirect('/')
                        } else {
                            res.redirect('/user_verification')
                        }
                    });
                })

            }

        });
    })(req, res, next);
}

// User Log Out:

const log_out = (req, res) => {

    req.logout();
    res.redirect('/')
}

// Verification User:

const verification_page = (req, res) => {

    res.render('./auth/user_verification.jade', {
        user: req.user
    })

}

const user_verification_post = (req, res) => {
    const { verification_code } = req.body;
    if (parseInt(req.user.verification_code) === parseInt(verification_code)) {
        res.redirect('/dashboard');
    }
    else {
        let user_id = req.user.id;
        let query = {
            _id: user_id
        };
        let data = {};
        data.verification_code = 0;
        User.update(query,data,(err)=>{
            req.flash('danger', 'Incorrect verification code. Try again.');
            res.redirect('/user_verification');
        })
    }
}


module.exports = {
    register_page: register_page,
    add_new_user: add_new_user,
    login_page: login_page,
    login_post: login_post,
    user_verification_post: user_verification_post,
    verification_page: verification_page,
    log_out: log_out,
}