const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: "Email is required",
    },
    first_name: {
        type: String,
        required: "First name is required",
    },
    last_name: {
        type: String,
        required: "Last name is required",
    },
    avatar: {
        type: String,
        required: true,
    }
}, {versionKey: false});

module.exports = mongoose.model("Users", usersSchema)

