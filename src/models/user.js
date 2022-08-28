const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');
const userSchema = new mongoose.Schema({                                            //mongoose.Schema is the design for the mongoose model 
    name: {
        type: String, 
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {                                                           //validate will be used to validate the property(here email), when entered property is validated as incorrect, error will be shown and document wont be saved
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password should not contain the word "password"');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a postive number');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});
//2 models should have one property each refering to the other model and at least one should not be virtual,
//here the tasks property of User is virtual and does not add to the database, this tasks property is connected to the
//real property of Task i.e. owner, the relation between the two model is now defined by the local field of the model(User)
// and the foreign field of the reference model(Task) which are actually the same as they both store the user id
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() {                                            //when res.send is done JSON.stringify is called and JSON.stringify automatically calls toJSON before it sends the data so this function is called without the need to explicitly call it
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;                                                     //these things are deleted from the user we are currently on, this is done to not show these data, however these still do exists in the database
    delete userObject.tokens;                                                       //these things remain in the database because this function is called when res.send() is called, at that time data is already saved in the database
    delete userObject.avatar;
    return userObject;
}
userSchema.methods.generateAuthToken = async function() {                           //methods is used for an instance that is on a single user, we can use this using user.function_name
    const user = this;
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};
//checking email and password for unique user login
userSchema.statics.findByCredentials = async (email,password) => {                  //statics is used to apply method to user model that is 'User' to use this function we can write User.function_name
    const user = await User.findOne({ email });
    if(!user) {
        throw new Error('Unable to Login!');
    }
    const isValid = await bcrypt.compare(password,user.password);
    if(!isValid) {
        throw new Error('Unable to login!');
    }
    return user;
};

//Hashing the password before saving
userSchema.pre('save',async function(next) {            // pre is used to automatically run this function whenever save(first argument of function) is done, this will be run first then the document will be saved
    const user = this;                                  //'this' stores the current user that is going to be saved
    
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);                //mongoose.model will define the userSchema as User and will make User a model to be used in Database

module.exports = User;