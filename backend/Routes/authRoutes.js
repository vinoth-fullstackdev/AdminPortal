const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User =require('../models/User');


router.post('/login',async(req,res)=>{
    
    const {username,password} = req.body;

    try{
        //check if user exists / not
        const user = User.find((prevuser)=> prevuser.username === username);
     if(!user){
        
        return res.status(400).send({message:"Invalid Credentials"})
     }

                //verify Password
     const isPasswordMatch = await bcrypt.compare(password,user.password )
    if(!isPasswordMatch){
        
        return res.status(400).send('Invalid Password')
    }

    //Generate JWT TOKEN
    const token =jwt.sign({id:user.id, username:user.username},process.env.JWT_SECRET,{
        
        expiresIn:"1h"
    });


    res.status(200).send({token, Message:'Login Successful'});
    }catch(error){
        res.status(400).send({error:'Login Failed'});
    }
    
});

module.exports = router