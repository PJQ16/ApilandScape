
module.exports ={
    getToken: (req)=>{
        return req.headers.authorization.replace('Bearer ', '');
    },
    isLogin:(req,res,next)=>{
        require('dotenv').config()
        const jwt = require('jsonwebtoken');

        if(req.headers.authorization != null){
        const token =  req.headers.authorization.replace('Bearer ', '');
        const secret = process.env.SECRET_KEY
        try{
            const verify = jwt.verify(token,secret);
            if(verify != null){
                next();
            }
        }catch(e){
            res.status(401).json('Authoriza Fail');
        }
     }
      
    }
}