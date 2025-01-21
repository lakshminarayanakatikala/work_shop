const mysql2 = require('mysql2')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
let salt = 10

let seckey = 'abcdefghijklmnopqrstuvwxyz1234567890'

let connection = mysql2.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'nodejs_tasks'
})

connection.connect((err)=>{
    if(err){
        console.log('err');
        
    }
    else{
        console.log('mysql connected');
        
    }
})


function adduser(email,password,role){

    return new Promise (async(resolve,reject)=>{

       
            const hash_pass = await bcrypt.hash(password,salt)
            console.log(hash_pass);
      
        connection.query('select * from work_shop  where email = ?',[email],(err,info)=>{
            if(err){
                reject(err)
            }else{
                if(info.length>0){
                    reject('username already exist')
                }
                else{
                    connection.query('insert into work_shop(email,password,role) values (?,?,?)',[email,hash_pass,role],(err,data)=>{
                        if(err){
                            reject(err.message)
                        }
                        else{
                            resolve(data)
                        }
                    })
                } 
            }
        })
    
    })
}


function login(email,password,role){

    return new Promise ((resolve,reject)=>{
        connection.query('select * from work_shop where email = ? ',[email],async(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                if(data.length > 0){

                    let original_pass = await bcrypt.compare(password,data[0].password)
                    console.log(original_pass);
                    if(original_pass && data[0].role === role){
                        let token = jsonwebtoken.sign({id:data[0].id},seckey)
                        console.log(token);
                        // resolve('login successfully')

                        // resolve({
                        //     msg : 'login successfully',
                        //     token : token
                        // })

                        connection.query('UPDATE work_shop SET token = ? WHERE email = ?',[token,email],(err,data)=>{
                            if(err){
                                reject(err)
                            }else{
                                resolve({
                                    msg : 'login successfully',
                                    token : token
                                })
                            }
                        })
                    }
                    else{
                        reject('invalied credentioals')
                    }
                

                }else{
                    reject('register first')
                }
            }
        })
    })

}






module.exports={adduser,login}