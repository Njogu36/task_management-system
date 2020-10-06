// Libraries

// Models
const User = require('../models/user.js');
const Assign = require('../models/assignment.js');

// Functions

const dashboard_page =(req,res)=>{
    Assign.find({user_id:req.user.id,type:'Action Items'},(err,action_items)=>{
        Assign.find({user_id:req.user.id,type:'Ideas'},(err,ideas)=>{
            Assign.find({user_id:req.user.id,type:'Backlog'},(err,backlog)=>{
                Assign.find({user_id:req.user.id},(err,assigns)=>{
                    
                    // Action Ideas
                    let todo_1 = 0
                    action_items.map((item)=>{
                        if(item.status === 'TO DO')
                        {
                            todo_1  += 1;
                        }
                    });
                    
                    let inprogress_1 = 0;
                    action_items.map((item)=>{
                        if(item.status === 'IN PROGRESS')
                        {
                            inprogress_1 += 1;
                        }
                    });
                    let revision_1 = 0
                    action_items.map((item)=>{
                        if(item.status === 'REVISION')
                        {
                            revision_1 +=1;
                        }
                    });
                    let review_1 = 0; 
                    action_items.filter((item)=>{
                        if(item.status === 'REVIEW')
                        {
                            review_1 += 1;
                        }
                    });
                    let complete_1 =  0;
                    action_items.map((item)=>{
                        if(item.status === 'COMPLETE')
                        {
                            complete_1 += 1;
                        }
                    });


                    // Ideas
                    let todo_2 = 0
                    ideas.map((item)=>{
                        if(item.status === 'TO DO')
                        {
                            todo_2  += 1;
                        }
                    });
                    
                    let inprogress_2 = 0;
                    ideas.map((item)=>{
                        if(item.status === 'IN PROGRESS')
                        {
                            inprogress_2 += 1;
                        }
                    });
                    let revision_2 = 0
                    ideas.map((item)=>{
                        if(item.status === 'REVISION')
                        {
                            revision_2 +=1;
                        }
                    });
                    let review_2 = 0; 
                    ideas.filter((item)=>{
                        if(item.status === 'REVIEW')
                        {
                            review_2 += 1;
                        }
                    });
                    let complete_2 =  0;
                    ideas.map((item)=>{
                        if(item.status === 'COMPLETE')
                        {
                            complete_2 += 1;
                        }
                    });



                    // Backlog
                    let todo_3 = 0
                    backlog.map((item)=>{
                        if(item.status === 'TO DO')
                        {
                            todo_3  += 1;
                        }
                    });
                    
                    let inprogress_3 = 0;
                    backlog.map((item)=>{
                        if(item.status === 'IN PROGRESS')
                        {
                            inprogress_3 += 1;
                        }
                    });
                    let revision_3 = 0
                    backlog.map((item)=>{
                        if(item.status === 'REVISION')
                        {
                            revision_3 +=1;
                        }
                    });
                    let review_3 = 0; 
                    backlog.filter((item)=>{
                        if(item.status === 'REVIEW')
                        {
                            review_3 += 1;
                        }
                    });
                    let complete_3 =  0;
                    backlog.map((item)=>{
                        if(item.status === 'COMPLETE')
                        {
                            complete_3 += 1;
                        }
                    });
                    setTimeout(()=>{
                        res.render('./account/dashboard/dashboard.jade',{
                            user:req.user,
                            action_items:action_items,
                            ideas:ideas,
                            backlog:backlog,
                            assigns:assigns,
                            todo_1:todo_1,
                            todo_2:todo_2,
                            todo_3:todo_3,
                            inprogress_1:inprogress_1,
                            inprogress_2:inprogress_2,
                            inprogress_3:inprogress_3,
                            review_1:review_1,
                            review_2:review_2,
                            review_3:review_3,
                            revision_1:revision_1,
                            revision_2:revision_2,
                            revision_3:revision_3,
                            complete_1:complete_1,
                            complete_2:complete_2,
                            complete_3:complete_3
    
    
                        })
                    },1500)
                   
                }).sort({_id:-1}).limit(6)
            })
        })
    })
   
}



module.exports = {
    dashboard_page:dashboard_page
}