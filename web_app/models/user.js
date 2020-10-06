const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
first_name:String,
last_name:String,
user_image:String,
username:String,
password:String,
verification_code:Number,
});
const User = mongoose.model('User',userSchema);
module.exports = User;