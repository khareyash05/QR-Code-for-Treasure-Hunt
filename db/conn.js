const mongoose = require("mongoose")
require('dotenv').config()

const DB = process.env.DB

mongoose.connect("mongodb+srv://yash:05112001@cluster0.73ns4.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser : true
}).then(()=>{
    console.log("Connected to database");
}).catch((err)=>{console.log(err);})