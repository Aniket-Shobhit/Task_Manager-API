const dotenv = require('dotenv');

const envPath = `./config/.env.${process.env.NODE_ENV}`;
dotenv.config({path: envPath})

const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
    console.log('Server is up on port ' + process.env.PORT);
});

// const multer = require('multer');

// const upload = multer({
//     dest: 'images',                                                    //destination is set here to give the path of where the data is to be stored
//     limits: {
//         fileSize: 1000000                                               //restricts the file to be uploaded to be under 1MB
//     },
//     fileFilter(req,file,cb) {                                           //1st argument contains info about the request sent, 2nd contains info on the file being uploaded and 3rd is the callback function that will tell multer that file is done being uploaded
//         // cb(undefined, true);
//         // cb(undefined, false);
//         if(!file.originalname.match(/\.(doc|docx)$/)) {                 //regular expresssion is used to check the file extension
//             return cb(new Error('Please upload a Word document'));
//         }
//         cb(undefined,true);
//     }
// });

// const errorMiddleware = (req,res,next) => {
//     throw new Error('From my middleware');
// };

// app.post('/upload', upload.single('upload'), (req,res) => {
//     res.send();
// }, (error,req,res,next) => {                                        //this 3rd argument function is used to handle errors and will run when an error is caught
//     res.status(400).send({ error: error.message });
// });


// app.use((req,res,next) => {                         //middleware function
//     if(req.method === 'GET') {
//         res.send('GET request are disabled!');
//     }
//     else {
//         next();
//     }
// });

// app.use((req,res,next) => {
//     res.status(503).send('Server is up for maintenance! Come back later');
// });

//Without middleware =  send request -> new route handler
//With middleware = send request -> do something -> new route handler


// const bcrypt = require('bcryptjs');

// const myFunction = async() => {
//     const password = 'peter';
//     const hashedPassword = await bcrypt.hash(password,8);
//     console.log(password);
//     console.log(hashedPassword);

//     const isEqual = await bcrypt.compare(password,hashedPassword);
//     console.log(isEqual);
    
// };

// myFunction();

// const myFunction = async () => {
//     const token = jwt.sign({_id: 'abc123'}, 'thisisthetoken', { expiresIn: '1 second' });
//     const isValid = jwt.verify(token,'thisisthetoken');
//     console.log(isValid);
// };

// myFunction();

// const pet = {
//     name: 'hey'
// };

// pet.toJSON = function() {
//     console.log(this);
//     return {};
// }

// console.log(JSON.stringify(pet));

//const main = async function() {
    // const task = await Task.findById('628b811962175840c11137ca');
    // await task.populate('owner');
    // console.log(task.owner);
    //const user = await User.findById('628b80af62175840c11137c4');
    //await user.populate('tasks');
    //console.log(user.tasks);
//}

//main();