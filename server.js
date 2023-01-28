const express = require("express");
const cors = require("cors");
const connectDb = require("./config/mongoDb");
const mongoose = require('mongoose');
const { logEvents } = require("./middleware/logger");
require('dotenv').config()

const app = express();

const PORT = process.env.PORT || 5000;

connectDb();

mongoose.connection.once('open', () => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
        console.log(`Server Started at http://localhost:${PORT}`)
    });
});

mongoose.connection.on('error', (error)=>{
    console.log(error);
    logEvents(`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`, 'mongoDBErrors.log');
})
