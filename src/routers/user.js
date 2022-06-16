const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');

router.get('/users/me', auth, async (req,res) => {          //Info of the user whose authentication is correct by comparing tokens
    res.send(req.user);
});

// router.get('/users', auth, async (req,res) => {          //Dont want user to see other user information even if their authentication is correct
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch(e) {
//         res.status(500).send('go');
//     }
//     // User.find({}).then((users) => {
//     //     res.send(users); 
//     // }).catch((e) => {
//     //     res.status(500).send();
//     // });
// });

router.get('/users/:id', async (req,res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch(e) {
        res.status(500).send();
    }
    // User.findById(_id).then((user) => {
    //     if(!user) {
    //         return res.status(404).send();
    //     }
    //     res.send(user);
    // }).catch((e) => {
    //     res.status(500).send();
    // });
    //console.log(req.params);
});

router.get('/users/:id/avatar', async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            throw new Error('pop');
        }
        res.set('Content-Type', 'image/png');                   //we have to tell what type of data is going to be sent, in all other cases we have dealt with json data where express automatically sets content-type to application/json
        res.send(user.avatar);
    } catch(e) {
        res.status(400).send();
    }
});

router.post('/users', async (req, res) => {
    // console.log(req.body);
    // res.send('testing');
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({ user, token });
    } catch(e) {
        res.status(400).send(e);
    }
    // user.save().then(() => {
    //     res.status(201).send(user);
    // }).catch((e) => {
    //     res.status(400).send(e);
    //     //res.send(e);
    // });
});

router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        //res.send({ user: user.getPublicProfile(), token });                               //no need to explicitly call the function 
        res.send({ user, token});                                                           //here the above function(getPublicProfile) will be called automatically if its name is toJSON because res.send calls JSON.stringify which calls toJSON before it
    } catch(e) {
        res.status(400).send(); 
    }
});

router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req,res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

const upload = multer({ 
    //dest: 'avatars',                                                              //destination is set here to give the path of where the data is to be stored
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a jpg, jpeg or png file only'));
        }
        cb(undefined,true);
    }                                                  
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {         //auth and upload.single are middleware functions. 
    //When dest property is not set in upload then the data is passed to the (req,res) function and the file can be accessed using req.file
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();   //we want the buffer data of the file uploaded so req.file.buffer
    req.user.avatar = buffer;                                              
    await req.user.save();
    res.send();
}, (error,req,res,next) => {
    res.status(400).send({ error:error.message });
});

router.patch('/users/:id', auth, async (req,res) => {                                             //user should not be able to update other user info with their id
    const updates = Object.keys(req.body);                                                  //returns all the keys of the object as array
    const allowedUpdates = ['name','email','age','password'];
    const isValidOperation = updates.every( update => allowedUpdates.includes(update) );
    if(!isValidOperation) {
        res.status(400).send({error: 'Invalid updates!'});
    }
    try {
        //const user = await User.findById(req.params.id);                                      //middleware function auth is used so req.user contains the user that is logged in i.e. autorized                               
        updates.forEach((update) => req.user[update] = req.body[update] );
        await req.user.save();
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{ new:true, runValidators: true });          
        //this method should not be used as it bypasses the mongoose model
        // if(!user) {                                                                          //since user is taken from the database who is currently logged in so they obviously exist so no need to check for unavailaibility of user
        //     res.status(404).send();
        // }
        res.send(req.user);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.delete('/users/me/avatar', auth, async (req,res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send();
    } catch(e) {
        res.status(400).send();
    }
});
router.delete('/users/me', auth, async (req,res) => {                               ////user should only be able to delete their own document
    try{
        await req.user.remove();
        res.send(req.user);
    } catch(e) {
        res.status(400).send();
    }
});

// router.delete('/users/:id', async (req,res) => {                                 //user should not be able to delete other user data with their id
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//         if(!user) {
//             res.status(404).send();
//         }
//         res.send(user);
//     } catch(e) {
//         res.status(400).send(e);
//     }
// });

module.exports = router;