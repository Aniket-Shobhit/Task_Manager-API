const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0                            //when completed and skip and limit are used together first the data is filter by completed query then the skip query is processed and then the limit
//GET /tasks?sortBy=createdAt:asc                       //sorting will be done as per the createdAt field in ascending order(desc is used for descending)
router.get('/tasks', auth, async (req,res) => {
    const match = {};
    const sort = {};                                   //if no query is written in url ...then it will be empty to show all completed as well as incompleted tasks
    if(req.query.completed) {
        match.completed = req.query.completed === 'true'        //if query is 'false' match will be false and all incompleted tasks will be shown vice versa for true
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'asc' ? 1:-1;     //the field according to which the data is to be sorted is given the value 1 when sorting in ascending order and -1 when we want the data in descending order
    }
    try {
        //const tasks = await Task.find({});
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        //const tasks = await Task.find({ owner: req.user._id})         //alternate approach
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send();
    }
    // Task.find({}).then((tasks) => {
    //     res.send(tasks);
    // }).catch((e) => {
    //     res.status(500).send();
    // });
});

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;                                                  //gives the id of the task we are looking for
    try {
        //const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id })         //gives the task we are looking for and is created by the user which is currently logged in
        if(!task) {
            res.status(404).send();
        }
        res.send(task);
    } catch(e) {
        res.status(500).send();
    }
    // Task.findById(_id).then((task) => {
    //     if(!task) {
    //         res.status(404).send();
    //     }
    //     res.send(task);
    // }).catch((e) => {
    //     res.status(500).send();
    // });
});

router.post('/tasks', auth, async (req,res) => {
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send();
    }
    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });
});

router.patch('/tasks/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isValidUpdate = updates.every( update => allowedUpdates.includes(update) );
    if(!isValidUpdate) {
        res.status(400).send({ error: 'Invalid Updates!'});
    }
    try {
        //const task = await Task.findById(req.params.id);
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{ new:true, runValidators:true });   //this methode bypasses the mongoose schema model
        if(!task) {
            res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update] );
        await task.save();
        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req,res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id});
        if(!task) {
            res.status(404).send();
        }
        else {
            res.send(task);
        }
    } catch(e) {
        console.log(e);
        res.status(400).send(e);
    }
});

module.exports = router;
