// Libraries
const nodemailer = require("nodemailer");

// Models

const Task = require('../models/task.js');
const User = require('../models/user.js');
const Assign = require('../models/assignment.js');

// Functions

// actions_items

const action_items_page = (req, res) => {
    User.find({}, (err, users) => {
        Assign.find({user_id:req.user.id,type:'Action Items'},(err,action_items)=>{
             Assign.find({user_id:req.user.id},(err,assigns)=>{
                        
                        // Action Ideas
                        let todo = []
                        let in_progress = []
                        let revision = []
                        let review = []
                        let complete =  []

                        action_items.map((item)=>{
                            if(item.status === 'TO DO')
                            {
                                todo.push(item)
                            }
                        });
                        action_items.map((item)=>{
                            if(item.status === 'IN PROGRESS')
                            {
                                in_progress.push(item)
                            }
                        })
                        action_items.map((item)=>{
                            if(item.status === 'REVISION')
                            {
                                revision.push(item)
                            }
                        })
                        action_items.filter((item)=>{
                            if(item.status === 'REVIEW')
                            {
                                review.push(item)
                            }
                        });
                        action_items.map((item)=>{
                            if(item.status === 'COMPLETE')
                            {
                                complete.push(item);
                            }
                        });
    
    
                        
                        setTimeout(()=>{
                            res.render('./account/tasks/action_items.jade',{
                                user:req.user,
                                action_items:action_items,
                                assigns:assigns,
                                todo:todo,
                                review:review,
                                revision:revision,
                                complete:complete,
                                users:users,
                                in_progress:in_progress,
        
        
                            })
                        },2000)
                       
                    })
                }).sort({priority_no:1})
    })

}

// ideas

const ideas_page = (req, res) => {
    User.find({}, (err, users) => {
         Assign.find({user_id:req.user.id,type:'Ideas'},(err,ideas)=>{
                  Assign.find({user_id:req.user.id},(err,assigns)=>{
                         
                        // Ideas
                        let todo_2 = []
                        let in_progress_2 = []
                        let revision_2 = []
                        let review_2 = []
                        let complete_2 =  []

                        ideas.map((item)=>{
                            if(item.status === 'TO DO')
                            {
                                todo_2.push(item)
                            }
                        });
                        ideas.map((item)=>{
                            if(item.status === 'IN PROGRESS')
                            {
                                in_progress_2.push(item)
                            }
                        })
                        ideas.map((item)=>{
                            if(item.status === 'REVISION')
                            {
                                revision_2.push(item)
                            }
                        })
                        ideas.filter((item)=>{
                            if(item.status === 'REVIEW')
                            {
                                review_2.push(item)
                            }
                        });
                        ideas.map((item)=>{
                            if(item.status === 'COMPLETE')
                            {
                                complete_2.push(item);
                            }
                        });
                      
                        setTimeout(()=>{
                            res.render('./account/tasks/ideas.jade',{
                                user:req.user,
                                ideas:ideas,
                                assigns:assigns,
                                todo:todo_2,
                                inprogress:in_progress_2,
                                review:review_2,
                                revision:revision_2,
                                complete:complete_2,
                                users:users
        
                            })
                        },2500)
                       
                    })
                }).sort({priority_no:1}) 
    })
}

// backlog

const backlog_page = (req, res) => {
    User.find({}, (err, users) => {
          Assign.find({user_id:req.user.id,type:'Backlog'},(err,backlog)=>{
                    Assign.find({user_id:req.user.id},(err,assigns)=>{
                        
    
                        // Backlog
                        let todo_3 = []
                        let in_progress_3 = []
                        let revision_3 = []
                        let review_3 = []
                        let complete_3 =  []

                        backlog.map((item)=>{
                            if(item.status === 'TO DO')
                            {
                                todo_3.push(item)
                            }
                        });
                        backlog.map((item)=>{
                            if(item.status === 'IN PROGRESS')
                            {
                                in_progress_3.push(item)
                            }
                        })
                        backlog.map((item)=>{
                            if(item.status === 'REVISION')
                            {
                                revision_3.push(item)
                            }
                        })
                        backlog.filter((item)=>{
                            if(item.status === 'REVIEW')
                            {
                                review_3.push(item)
                            }
                        });
                        backlog.map((item)=>{
                            if(item.status === 'COMPLETE')
                            {
                                complete_3.push(item);
                            }
                        });
                        setTimeout(()=>{
                            res.render('./account/tasks/backlog.jade',{
                                user:req.user,
                                backlog:backlog,
                                assigns:assigns,
                                todo:todo_3,
                                inprogress:in_progress_3,
                                review:review_3,
                                revision:revision_3,
                                complete:complete_3,
                                users:users
        
        
                            })
                        },2500)
                       
                    })
                }).sort({priority_no:1})
            })
}


// Other


// Add task

const add_new_task = (req, res) => {
    const { type } = req.body;
    let data = new Task()

    let assigned_to = []

    if (req.body.assigned_to === undefined) {
        assigned_to = []
    }
    else if (Array.isArray(req.body.assigned_to)) {
        req.body.assigned_to.map((item) => {
            User.findById(item, (err, user) => {
                let obj = {
                    id: user.id,
                    full_name: user.first_name + ' ' + user.last_name
                }
                assigned_to.push(obj)
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
                    subject: 'Assigned to you: ' + req.body.title,
                    text: 'A new task has been assigned to you:\n' +'Title: '+  req.body.title +'\n'+'Due Date: '+req.body.due_date+'\n'+'Description: '+req.body.description
                  };
          
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log('Email not sent')
                    } else {
                      console.log('Email Sent')
                    }
                  });
            })
        })
    }
    else {
        User.findById(req.body.assigned_to, (err, user) => {
            let obj = {
                id: user.id,
                full_name: user.first_name + ' ' + user.last_name
            }
            assigned_to = [obj]
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
                subject: 'Assigned to you: ' + req.body.title,
                text: 'A new task has been assigned to you:\n' +'Title: '+  req.body.title +'\n'+'Due Date: '+req.body.due_date+'\n'+'Description: '+req.body.description
              };
      
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log('Email not sent')
                } else {
                  console.log('Email Sent')
                }
              });
        })
    }
    setTimeout(()=>{
    if (parseInt(req.params.page) === 1) {
        Task.findOne({title:req.body.title,type:'Action Items',status:type},(err,task)=>{
            if(task)
            {
              req.flash('danger','Task already exists.')
              res.redirect('/action_items')
            }
            else
            {
                data.user_id = req.user.id,
                data.title = req.body.title,
                data.description = req.body.description,
                data.status = type,
                data.start_date = req.body.start_date,
                data.start_time = req.body.start_time,
                data.due_date = req.body.due_date,
                data.due_time = req.body.due_time,
                data.type = 'Action Items',
                data.priority = req.body.priority
                if(req.body.priority === 'High')
                {
                  data.priority_no = 1
                }
                else if(req.body.priority === 'Normal')
                {
                    data.priority_no = 2
                }
                else if(req.body.priority === 'Low')
                {
                    data.priority_no = 3
                }
                data.assigned_to = assigned_to,
                data.created_on = new Date(),
                data.enabled = true
            data.created_by = req.user.first_name + ' ' + req.user.last_name
            data.save((err, result) => {
                if (req.body.assigned_to === undefined) {
                    req.flash('info', 'Task added successfully.')
                    res.redirect('/action_items')
                }
                else if (Array.isArray(req.body.assigned_to)) {
                    req.body.assigned_to.map((item) => {
                        User.findById(item, (err, user) => {
                            let data = new Assign();
                            data.task = result;
                            data.task_id = result.id
                            data.type = 'Action Items';
                            data.status = type;
                            data.user_id = user.id;
                            data.user_name = user.first_name + ' ' + user.last_name;
                            data.user_email = user.email
                            data.created_by = req.user.id
                            data.priority = req.body.priority
                            if(req.body.priority === 'High')
                            {
                              data.priority_no = 1
                            }
                            else if(req.body.priority === 'Normal')
                            {
                                data.priority_no = 2
                            }
                            else if(req.body.priority === 'Low')
                            {
                                data.priority_no = 3
                            }
                            data.save(() => {
                                
                            })
                        })
                    })
                    req.flash('info', 'Task added successfully.')
                                res.redirect('/action_items')
                }
                else {
                    User.findById(req.body.assigned_to, (err, user) => {
                        let data = new Assign();
                        data.task = result;
                        data.task_id = result.id
                        data.type = 'Action Items';
                        data.status = type;
                        data.user_id = user.id;
                        data.user_name = user.first_name + ' ' + user.last_name;
                        data.user_email = user.email
                        data.priority = req.body.priority
                        data.created_by = req.user.id
                        if(req.body.priority === 'High')
                        {
                          data.priority_no = 1
                        }
                        else if(req.body.priority === 'Normal')
                        {
                            data.priority_no = 2
                        }
                        else if(req.body.priority === 'Low')
                        {
                            data.priority_no = 3
                        }
                        data.save(() => {
                            req.flash('info', 'Task added successfully.')
                            res.redirect('/action_items')
                        })
                    })
                }
            })
            }
        })
      
    }

    else if (parseInt(req.params.page) === 2) {
        Task.findOne({title:req.body.title,type:'Ideas',status:type},(err,task)=>{
            if(task)
            {
              req.flash('danger','Task already exists.');
              res.redirect('/ideas')
            }
            else
            {
                data.user_id = req.user.id,
                data.title = req.body.title,
                data.description = req.body.description,
                data.status = type,
                data.start_date = req.body.start_date,
                data.start_time = req.body.start_time,
                data.due_date = req.body.due_date,
                data.due_time = req.body.due_time,
                data.type = 'Ideas',
                data.assigned_to = assigned_to,
                data.priority = req.body.priority
                
                if(req.body.priority === 'High')
                {
                  data.priority_no = 1
                }
                else if(req.body.priority === 'Normal')
                {
                    data.priority_no = 2
                }
                else if(req.body.priority === 'Low')
                {
                    data.priority_no = 3
                }
                data.enabled = true
                data.created_on = new Date(),
                data.created_by = req.user.first_name + ' ' + req.user.last_name
                 data.save((err, result) => {
                if (req.body.assigned_to === undefined) {
                    req.flash('info', 'Task added successfully.')
                    res.redirect('/ideas')
                }
                else if (Array.isArray(req.body.assigned_to)) {
                    req.body.assigned_to.map((item) => {
                        User.findById(item, (err, user) => {
                            let data = new Assign();
                            data.task = result;
                            data.task_id = result.id
                            data.type = 'Ideas';
                            data.status = type;
                            data.user_id = user.id;
                            data.user_name = user.first_name + ' ' + user.last_name;
                            data.user_email = user.email
                            data.priority = req.body.priority
                            data.created_by = req.user.id
                            if(req.body.priority === 'High')
                            {
                              data.priority_no = 1
                            }
                            else if(req.body.priority === 'Normal')
                            {
                                data.priority_no = 2
                            }
                            else if(req.body.priority === 'Low')
                            {
                                data.priority_no = 3
                            }
                            data.save(() => {
                                
                            })
                        })
                    })
                    req.flash('info', 'Task added successfully.')
                    res.redirect('/ideas')
                }
                else {
                    User.findById(req.body.assigned_to, (err, user) => {
                        let data = new Assign();
                        data.task = result;
                        data.task_id = result.id
                        data.type = 'Ideas';
                        data.status = type;
                        data.user_id = user.id;
                        data.user_name = user.first_name + ' ' + user.last_name;
                        data.user_email = user.email
                        data.priority = req.body.priority
                        data.created_by = req.user.id
                        if(req.body.priority === 'High')
                        {
                          data.priority_no = 1
                        }
                        else if(req.body.priority === 'Normal')
                        {
                            data.priority_no = 2
                        }
                        else if(req.body.priority === 'Low')
                        {
                            data.priority_no = 3
                        }
                        data.save(() => {
                            req.flash('info', 'Task added successfully.')
                            res.redirect('/ideas')
                        })
                    })
                }
    
            })
            }
        })
            
    }

    else if (parseInt(req.params.page) === 3) {
        Task.findOne({title:req.body.title,type:'Backlog',status:type},(err,task)=>{
            if(task)
            {
                 req.flash('danger','Task already exists.');
                 res.redirect('/backlog')
            }
            else
            {
                data.user_id = req.user.id,
                data.title = req.body.title,
                data.description = req.body.description,
                data.status = type,
                data.start_date = req.body.start_date,
                data.start_time = req.body.start_time,
                data.due_date = req.body.due_date,
                data.due_time = req.body.due_time,
                data.type = 'Backlog',
                data.priority = req.body.priority
                if(req.body.priority === 'High')
                {
                  data.priority_no = 1
                }
                else if(req.body.priority === 'Normal')
                {
                    data.priority_no = 2
                }
                else if(req.body.priority === 'Low')
                {
                    data.priority_no = 3
                }
                data.enabled = true
                data.assigned_to = assigned_to,
                data.created_on = new Date(),
                data.created_by = req.user.first_name + ' ' + req.user.last_name
                data.save((err, result) => {
    
                if (req.body.assigned_to === undefined) {
                    req.flash('info', 'Task added successfully.')
                    res.redirect('/backlog')
                }
                else if (Array.isArray(req.body.assigned_to)) {
                    req.body.assigned_to.map((item) => {
                        User.findById(item, (err, user) => {
                            let data = new Assign();
                            data.task = result;
                            data.task_id = result.id
                            data.type = 'Backlog';
                            data.status = type;
                            data.user_id = user.id;
                            data.user_name = user.first_name + ' ' + user.last_name;
                            data.user_email = user.email
                            data.priority = req.body.priority
                            data.created_by = req.user.id
                            if(req.body.priority === 'High')
                            {
                              data.priority_no = 1
                            }
                            else if(req.body.priority === 'Normal')
                            {
                                data.priority_no = 2
                            }
                            else if(req.body.priority === 'Low')
                            {
                                data.priority_no = 3
                            }
                            data.save(() => {
                                
                            })
                        })
                    })
                    req.flash('info', 'Task added successfully.')
                                res.redirect('/backlog')
                }
                else {
                    User.findById(req.body.assigned_to, (err, user) => {
                        let data = new Assign();
                        data.task = result;
                        data.task_id = result.id
                        data.type = 'Backlog';
                        data.status = type;
                        data.user_id = user.id;
                        data.user_name = user.first_name + ' ' + user.last_name;
                        data.user_email = user.email
                        data.priority = req.body.priority
                        data.created_by = req.user.id
                        if(req.body.priority === 'High')
                        {
                          data.priority_no = 1
                        }
                        else if(req.body.priority === 'Normal')
                        {
                            data.priority_no = 2
                        }
                        else if(req.body.priority === 'Low')
                        {
                            data.priority_no = 3
                        }
                        data.save(() => {
                            req.flash('info', 'Task added successfully.')
                            res.redirect('/backlog')
                        })
                    })
                }
            }) 
            }
        })
        
    }
},1000)
}

//  task  details

const task_details = (req, res) => {
    User.find({}, (err, users) => {
    Task.findById(req.params.id, (err, task) => {
        res.render('./account/tasks/task_details.jade', {
            user: req.user,
            task: task,
            users:users,
            page: req.params.page
        })
    })
})
}

// edit task

const edit_task = (req, res) => {
    User.find({}, (err, users) => {
    Task.findById(req.params.id,(err,task)=>{
        res.render('./account/tasks/edit_task.jade', {
            user: req.user,
            page:req.params.page,
            task:task,
            users:users
        })
    })
})
    
}

const edit_task_post = (req, res) => {
    const { type } = req.body;
    let query = {
        _id:req.params.id
    }
    let data = {}

    let assigned_to = []

    if (req.body.assigned_to === undefined) {
        assigned_to = []
    }
    else if (Array.isArray(req.body.assigned_to)) {
        req.body.assigned_to.map((item) => {
            User.findById(item, (err, user) => {
                let obj = {
                    id: user.id,
                    full_name: user.first_name + ' ' + user.last_name
                }
                assigned_to.push(obj)
            })
        })
    }
    else {
        User.findById(req.body.assigned_to, (err, user) => {
            let obj = {
                id: user.id,
                full_name: user.first_name + ' ' + user.last_name
            }
            assigned_to = [obj]
        })
    }
    setTimeout(()=>{
    if (parseInt(req.params.page) === 1) {
        
                
                data.title = req.body.title,
                data.description = req.body.description,
                data.start_date = req.body.start_date,
                data.start_time = req.body.start_time,
                data.due_date = req.body.due_date,
                data.due_time = req.body.due_time,
                data.priority = req.body.priority
                if(req.body.priority === 'High')
                {
                  data.priority_no = 1
                }
                else if(req.body.priority === 'Normal')
                {
                    data.priority_no = 2
                }
                else if(req.body.priority === 'Low')
                {
                    data.priority_no = 3
                }
                data.assigned_to = assigned_to,
               
            Task.update(query,data,(err) => {
                Task.findById(req.params.id,(err,result)=>{

                Assign.remove({task_id:req.params.id},(err)=>{
                            
              
                if (req.body.assigned_to === undefined) {
                    req.flash('info', 'Task updated successfully.')
                    res.redirect('/action_items')
                }
                else if (Array.isArray(req.body.assigned_to)) {
                    
                    req.body.assigned_to.map((item) => {
                       
                        User.findById(item, (err, user) => {
                            let data = new Assign();
                            data.task = result;
                            data.task_id = result.id
                            data.type = 'Action Items';
                            data.status = result.status;
                            data.user_id = user.id;
                            data.user_name = user.first_name + ' ' + user.last_name;
                            data.user_email = user.email
                            data.created_by = req.user.id
                            data.priority = req.body.priority
                            if(req.body.priority === 'High')
                            {
                              data.priority_no = 1
                            }
                            else if(req.body.priority === 'Normal')
                            {
                                data.priority_no = 2
                            }
                            else if(req.body.priority === 'Low')
                            {
                                data.priority_no = 3
                            }
                            data.save(() => {
                                
                            })
                        })
                    })
                    req.flash('info', 'Task updated successfully.')
                                res.redirect('/action_items')
                }
                else {
                  
                    User.findById(req.body.assigned_to, (err, user) => {
                        let data = new Assign();
                        data.task = result;
                        data.task_id = result.id
                        data.type = result.type;
                        data.status = result.status;
                        data.user_id = user.id;
                        data.user_name = user.first_name + ' ' + user.last_name;
                        data.user_email = user.email
                        data.priority = req.body.priority
                        data.created_by = req.user.id
                        if(req.body.priority === 'High')
                        {
                          data.priority_no = 1
                        }
                        else if(req.body.priority === 'Normal')
                        {
                            data.priority_no = 2
                        }
                        else if(req.body.priority === 'Low')
                        {
                            data.priority_no = 3
                        }
                        data.save(() => {
                            req.flash('info', 'Task updated successfully.')
                            res.redirect('/action_items')
                        })
                    })
                }
            })
            
        })
    })
    }

    else if (parseInt(req.params.page) === 2) {
      
                
                data.title = req.body.title,
                data.description = req.body.description,
                data.start_date = req.body.start_date,
                data.start_time = req.body.start_time,
                data.due_date = req.body.due_date,
                data.due_time = req.body.due_time,
                data.assigned_to = assigned_to,
                data.priority = req.body.priority
                
                if(req.body.priority === 'High')
                {
                  data.priority_no = 1
                }
                else if(req.body.priority === 'Normal')
                {
                    data.priority_no = 2
                }
                else if(req.body.priority === 'Low')
                {
                    data.priority_no = 3
                }
                
                Task.update(query,data,(err, result) => {
                    Task.findById(req.params.id,(err,result)=>{

                        Assign.remove({task_id:req.params.id},(err)=>{
                                    
                      
                if (req.body.assigned_to === undefined) {
                    req.flash('info', 'Task updated successfully.')
                    res.redirect('/ideas')
                }
                else if (Array.isArray(req.body.assigned_to)) {
                    Assign.remove({task_id:req.params.id},(err)=>{
                            
                    })
                    req.body.assigned_to.map((item) => {
                       
                        User.findById(item, (err, user) => {
                            let data = new Assign();
                            data.task = result;
                            data.task_id = result.id
                            data.type = result.type;
                            data.status = result.status;
                            data.user_id = user.id;
                            data.user_name = user.first_name + ' ' + user.last_name;
                            data.user_email = user.email
                            data.priority = req.body.priority
                            data.created_by = req.user.id
                            if(req.body.priority === 'High')
                            {
                              data.priority_no = 1
                            }
                            else if(req.body.priority === 'Normal')
                            {
                                data.priority_no = 2
                            }
                            else if(req.body.priority === 'Low')
                            {
                                data.priority_no = 3
                            }
                            data.save(() => {
                                
                            })
                        })
                    })
                    req.flash('info', 'Task updated successfully.')
                    res.redirect('/ideas')
                }
                else {
                    Assign.remove({task_id:req.params.id},(err)=>{
                            
                    })
                    User.findById(req.body.assigned_to, (err, user) => {
                        let data = new Assign();
                        data.task = result;
                        data.task_id = result.id
                        data.type = result.type;
                        data.status = result.status;
                        data.user_id = user.id;
                        data.user_name = user.first_name + ' ' + user.last_name;
                        data.user_email = user.email
                        data.priority = req.body.priority
                        data.created_by = req.user.id
                        if(req.body.priority === 'High')
                        {
                          data.priority_no = 1
                        }
                        else if(req.body.priority === 'Normal')
                        {
                            data.priority_no = 2
                        }
                        else if(req.body.priority === 'Low')
                        {
                            data.priority_no = 3
                        }
                        data.save(() => {
                            req.flash('info', 'Task updated successfully.')
                            res.redirect('/ideas')
                        })
                    })
                }
    
            })
        })
    })
            
    }

    else if (parseInt(req.params.page) === 3) {
      
                data.title = req.body.title,
                data.description = req.body.description,
                data.start_date = req.body.start_date,
                data.start_time = req.body.start_time,
                data.due_date = req.body.due_date,
                data.due_time = req.body.due_time,
                data.priority = req.body.priority
                if(req.body.priority === 'High')
                {
                  data.priority_no = 1
                }
                else if(req.body.priority === 'Normal')
                {
                    data.priority_no = 2
                }
                else if(req.body.priority === 'Low')
                {
                    data.priority_no = 3
                }
               
                data.assigned_to = assigned_to,
              
                Task.update(query,data,(err, result) => {
                    Task.findById(req.params.id,(err,result)=>{

                        Assign.remove({task_id:req.params.id},(err)=>{
                                    
                      
                if (req.body.assigned_to === undefined) {
                    req.flash('info', 'Task updated successfully.')
                    res.redirect('/backlog')
                }
                else if (Array.isArray(req.body.assigned_to)) {
                    Assign.remove({task_id:req.params.id},(err)=>{
                            
                    })
                    req.body.assigned_to.map((item) => {
                        User.findById(item, (err, user) => {
                            let data = new Assign();
                            data.task = result;
                            data.task_id = result.id
                            data.type = result.type;
                            data.status = result.status;
                            data.user_id = user.id;
                            data.user_name = user.first_name + ' ' + user.last_name;
                            data.user_email = user.email
                            data.priority = req.body.priority
                            data.created_by = req.user.id
                            if(req.body.priority === 'High')
                            {
                              data.priority_no = 1
                            }
                            else if(req.body.priority === 'Normal')
                            {
                                data.priority_no = 2
                            }
                            else if(req.body.priority === 'Low')
                            {
                                data.priority_no = 3
                            }
                            data.save(() => {
                                
                            })
                        })
                    })
                    req.flash('info', 'Task updated successfully.')
                                res.redirect('/backlog')
                }
                else {
                    Assign.remove({task_id:req.params.id},(err)=>{
                            
                    })
                    User.findById(req.body.assigned_to, (err, user) => {
                        let data = new Assign();
                        data.task = result;
                        data.task_id = result.id
                        data.type = result.type;
                        data.status = result.status;
                        data.user_id = user.id;
                        data.user_name = user.first_name + ' ' + user.last_name;
                        data.user_email = user.email
                        data.priority = req.body.priority
                        data.created_by = req.user.id
                        if(req.body.priority === 'High')
                        {
                          data.priority_no = 1
                        }
                        else if(req.body.priority === 'Normal')
                        {
                            data.priority_no = 2
                        }
                        else if(req.body.priority === 'Low')
                        {
                            data.priority_no = 3
                        }
                        data.save(() => {
                            req.flash('info', 'Task updated successfully.')
                            res.redirect('/backlog')
                        })
                    })
                }
            }) 
        })
    })
        
        
    }
},2500)

}

// delete task

const delete_task = (req, res) => {
    
    Task.findByIdAndRemove(req.params.id, (err) => {
        Assign.remove({task_id:req.params.id},(err)=>{
            req.flash('danger', 'Task deleted successfully.');
            if (parseInt(req.params.page) === 1) {
                res.redirect('/action_items')
            }
            else if (parseInt(req.params.page) === 2) {
                res.redirect('/ideas')
            }
            else if (parseInt(req.params.page) === 3) {
                res.redirect('/backlog')
            }
        })
        
    })

}
const proceed = (req,res)=>{

    Task.findById(req.params.id,(err,task)=>{
        let query = {
            _id:req.params.id
        }
        let data = {};
        if(task.status === 'TO DO')
        {
            data.status = 'IN PROGRESS'
            Assign.update({"task_id": req.params.id}, {"$set":{"status": "IN PROGRESS"}}, {"multi": true},(err)=>{

            })
        }
        else if(task.status === 'IN PROGRESS')
        {
            data.status = 'REVIEW'
            Assign.update({"task_id": req.params.id}, {"$set":{"status": "REVIEW"}}, {"multi": true},(err)=>{
                
            })
        }
        else if(task.status === 'REVIEW')
        {
            data.status = 'REVISION'
            Assign.update({"task_id": req.params.id}, {"$set":{"status": "REVISION"}}, {"multi": true},(err)=>{
                
            })
        }
        else if(task.status === 'REVISION')
        {
            data.status = 'COMPLETE'
            Assign.update({"task_id": req.params.id}, {"$set":{"status": "COMPLETE"}}, {"multi": true},(err)=>{
                
            })
        }
        
        Task.update(query,data,(err)=>{
            if (parseInt(req.params.page) === 1) {
                res.redirect('/action_items')
            }
            if (parseInt(req.params.page) === 2) {
                res.redirect('/ideas')
            }
            if (parseInt(req.params.page) === 3) {
                res.redirect('/backlog')
            }
      
        })
        
    })
}

module.exports = {
    action_items_page: action_items_page,
    ideas_page: ideas_page,
    backlog_page: backlog_page,
    add_new_task: add_new_task,
    task_details: task_details,
    edit_task: edit_task,
    edit_task_post: edit_task_post,
    delete_task: delete_task,
    proceed:proceed

}