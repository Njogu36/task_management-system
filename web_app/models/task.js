const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
user_id:String,
title:String,
description:String,
status:String,
start_date:String,
start_time:String,
due_date:String,
due_time:String,
type:String,
assigned_to:[],
enabled:Boolean,
priority:String,
priority_no:Number,
created_on:String,
created_by:String,

});
const Task = mongoose.model('Task',taskSchema);
module.exports = Task;