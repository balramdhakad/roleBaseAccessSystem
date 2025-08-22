const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique  : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
    },

    fullname : {
        type : String,
        required : true,
    },

    role : {
        type : String,
        enum : ["developer" , "manager" , "admin"],
        required : true,
        default : "developer"
    }

},{
    timestamps : true
})

module.exports = mongoose.model("User",userSchema)