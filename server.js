const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json())
const Team = require("./model/teamSchema")

require("./db/conn")

const qrGroup = [
    ['0','1','2','3'],
    ['4','5','6','7'],
    ['8','9','10','11'],
    ['12','13','14','15'],
    ['16','17','18','19'] 
]

app.get("/register") // will be written later

app.post("/register",async(req,res)=>{
    const {name,email} = req.body
    
    if(!name||!email){
        return res.status(422).json({error: "Fill the field"})
    }   
    
    try{
        const teamExist = await Team.findOne({email : email})
        if(teamExist){
            return res.status(422).json({error: "Team already exist"})
        }
        else{
                const newTeam = new Team({
                    name : name,
                    email : email
                })
                await newTeam.save() 
                const a = await Team.findOne({email : email})  
                let path =[]                             
                for (var i=0;i<qrGroup.length;i++){
                    path.push(Math.floor(Math.random() * i))
                }
                console.log(path);
                    // path= [Math.floor(Math.random() * qrGroup1.length), Math.floor(Math.random() * qrGroup2.length) , Math.floor(Math.random() * qrGroup3.length) , Math.floor(Math.random() * qrGroup4.length) , Math.floor(Math.random() * qrGroup5.length)]
                await Team.findByIdAndUpdate(a._id , {path:path},{ new: true })
                res.send(path)           
        }
                
    }catch(err){
        console.log(err);
    }
})

app.get("/scan/:id",async(req,res)=>{ // need to add functionality for qr code unique id
    // ask for email id 
    const id = req.params.id;
})

app.post("/scan/:id",async(req,res)=>{
    const email = req.body.email;
    const teamData = await Team.findOne({email : email})
    const qrCodeValue = req.params.id
    console.log(qrCodeValue);

    // we need divide for mongodb work
    let x = Math.floor(qrCodeValue/4)
    let y = Object.values(teamData.path)[x]
    console.log(x);
    console.log(Object.values(teamData.path)[x])

    // we will need % to check for values
    let b = qrCodeValue%4; // will be suitable for array indexing
    let z = qrGroup[x]
    console.log(Object.values(z)[b]) //13
    let w = Math.floor(Object.values(z)[b]%4)
    console.log(w);
    if(y===w)
        res.send("ok")
    else 
        // time reduction by 5 seconds
        res.send("Time reduction by 5 seconds")
})

app.listen(3000)