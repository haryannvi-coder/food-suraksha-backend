const mongoose = require("mongoose");

const fsoSchema = new mongoose.Schema({
    email : {
        type: 'string',
        required: true,
        unique: true
    },
    password : {
        type: 'string',
        required: true
    },
    name : {
        type: 'string',
        required: true
    },
})

const fsoUser = mongoose.model("Fso", fsoSchema);


module.exports = fsoUser;