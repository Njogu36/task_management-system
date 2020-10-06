const mongoose =require('mongoose');
const notificationSchema = mongoose.Schema({
created_on:Date,
task:{},
message:String,
user_id:String
})
const Notification = mongoose.model('Notification',notificationSchema);
module.exports =Notification