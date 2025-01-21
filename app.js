const express = require('express')
const cors = require('cors')
const db = require('./db.js')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
let port = 4050

app.get('/',(req,res)=>{
    res.send('this is root page')
})
app.post('/reg',(req,res)=>{
    let {email , password , role}= req.body

    db.adduser(email,password,role)
    .then((addData)=>{
        res.status(200).send(addData)
    })
    .catch((err)=>{
        res.status(400).send(err)
    })
})

app.post('/login',(req,res)=>{
    let {email,password,role} = req.body

    db.login(email,password,role)
    .then((addData)=>{
        res.send(addData)
    })
    .catch((err)=>{
        res.send(err)
    })
    

})


app.listen(port ,()=>{
    console.log('server start___');
    
})