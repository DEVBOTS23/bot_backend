const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Admins', userSchema);