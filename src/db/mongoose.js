const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    // useFindAndModify: true
});

// const me = new User({
//     name: '   Mike',
//     email: '   miKE@MD.IO   ',
//     password: '     pas'
// });

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error', error);
// });



// const chores = new task({
//     description: 'studying',
// });

// chores.save().then(() => {
//     console.log(chores);
// }).catch((error) => {
//     console.log('Error',error);
// });
