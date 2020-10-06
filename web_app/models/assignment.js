const mongoose = require('mongoose');
const assignSchema = mongoose.Schema({
    task: {},
    type: String,
    status: String,
    user_id: String,
    task_id:String,
    user_name: String,
    user_email: String,
    priority: String,
    priority_no: Number,
    created_by:String

});
const Assign = mongoose.model('Assign', assignSchema);
module.exports = Assign