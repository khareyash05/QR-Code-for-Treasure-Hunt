const mongoose = require("mongoose")
require('dotenv').config()

const DB = process.env.DB

mongoose.connect(process.env.DB,{
    useNewUrlParser : true
}).then(()=>{
    console.log("Connected to database");
}).catch((err)=>{console.log(err);})
