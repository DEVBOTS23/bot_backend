const mongoose = require('mongoose');

const connectDb = ()=>{
    try {
        console.log(process.env.DATABASE_URI, "========");
        mongoose.connect(process.env.DATABASE_URI);
    } catch (error) {
        console.log(error);        
    }
}

module.exports = connectDb;