const jwt = require('jsonwebtoken');


const Protect = (req,res,next)=>{
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startWith("Bearer") ){
        try{
            token = req.headers.authorization.split(" ")[1]; //Extract the token
            const decoded = jwt.verify(token,process.env.JWT_SECRET);//Verify token
            req.user = decoded;
            next();
        }catch(error){
            return res.status(400).send({error:'Not Authorized, its failed'});
        }
    }

if(!token){
    return res.status(500).send('Not Authorized')
    }
};

module.exports = Protect