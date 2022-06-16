//const mongodb = require('mongodb');
//const MongoClient = mongodb.MongoClient;
//const ObjectID = mongodb.ObjectID;
const {MongoClient, ObjectID, ObjectId } = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID()
// console.log(id);
// console.log(id.id);

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error,client) => {
    if(error) {
        return console.log('Error connecting to the database');
    }
    
    const db = client.db(databaseName);
    // db.collection('users').insertOne({                                       //INSERT
    //     name: 'Aniket',
    //     age: 20
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert user');
    //     }
    //     console.log(result.insertedId);
    // });
    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 19
    //     },
    //     {
    //         name: 'Gunther',
    //         age: 23
    //     }
    // ], (error,result) => {
    //     if(error) {
    //         return console.log('Unable to insert documents');
    //     }
    //     console.log(result.insertedIds);
    // });
    //db.collection('tasks').insertMany([
    //    {
    //        description: 'Running',
    //        completed: true
    //    },
    //    {
    //        desciption: 'studying',
    //        completed: true
    //    },
    //    {
    //        description: 'shopping',
    //        completed: true
    //    }
    //], (error,result) => {
    //    if(error) {
    //        return console.log('Unable to insert documents');
    //    }
    //    console.log(result.insertedIds);
    //});

    // db.collection('tasks').insertOne({
    //     description: 'Studying',
    //     completed: false
    // });

    // db.collection('users').findOne({ _id: new ObjectId("6268059a4406ab9ae06e08c0") }, (error, user) => {         //FIND
    //     if(error) {
    //         return console.log('Unable to fetch');
    //     }
        
    //     console.log(user);
    // })

    // db.collection('users').find({ age: 20}).toArray((error, users) => {
    //     console.log(users);
    // })
    // db.collection('users').find({ age: 20}).count((error, count) => {
    //     console.log(count);
    // })

    // db.collection('tasks').findOne({ _id: new ObjectId("6268eb1f3db08bc90666576a")} , (error,task) => {
    //     console.log(task);
    // })
    // db.collection('tasks').find({ completed: false}).toArray((error, tasks) => {
    //     console.log(tasks);
    // })

    // db.collection('users').updateOne({                                                   //UPDATE
    //     _id: new ObjectId("62680312cfe57a1e7322a812")
    // },{
    //     $inc: {
    //         age: 5
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });

    // db.collection('users').deleteMany({                                              //DELETE
    //     name: 'Aniket'
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection('tasks').deleteOne({
    //     desciption: 'studying'
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error);
    // })
});
