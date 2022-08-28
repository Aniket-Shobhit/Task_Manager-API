const express = require('express');

const dotenv = require('dotenv');
const envPath = `./config/.env.${process.env.NODE_ENV}`;
dotenv.config({path: envPath})

require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;