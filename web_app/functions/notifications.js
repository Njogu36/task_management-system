// Libraries

// Models
const Notification = require('../models/notification.js')

// Functions


const notifications_page = (req, res) => {
    Notification.find({user_id:req.user.id},(err,notifications)=>{
        res.render('./account/notifications/notifications.jade', {
            user: req.user,
            notifications:notifications
        })
    })
   
}

module.exports = {
    notifications_page: notifications_page
}