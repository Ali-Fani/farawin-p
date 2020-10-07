require('dotenv').config();
const jwt = require("jsonwebtoken");


const validate=(req,res,next)=>{
    try{
        const {username,password}=req.body;
        if(!username ){
            res.status(401).json({status:"failed",error:"provide username"});
            return;
          }
          if(username.length <=3){
            res.status(401).json({status:"failed",error:"username is too short (<=3)"});
            return;
          }
          if (!password){
            res.status(401).json({status:"failed",error:"provide password"});
            return;
          }
          if(password.length<=8){
              res.status(401).json({status:"failed",error:"password is too short"});
              return;
          }
          if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)){
            res.status(401).json({status:"failed",error:"password is too weak"});
            return;
          }
    }
    catch(err){
        console.error(err);
    }
    finally{
        next();
    }
}
const auth=(req,res,next)=>{
    try {
        const token=req.headers.access_token;
        if(!token){
            console.error("token not found");
            res.status(401).json({status: "failed",error:"access token is required"});
            return;
        }
        const decoded=jwt.verify(token,process.env.SECRET);
        if(req.method=="POST" || req.method=="PATCH" || req.method=="DELETE"){
            req.body.user=decoded.id;
            req.body.isAdmin=decoded.isAdmin;
        }
        if (req.method == "GET"){
            req.headers["user"]=decoded.id;
            req.body.isAdmin=decoded.isAdmin;
        }
        
        next()
    } catch (err) {
        res.status(403).json({ success: false, error: "middle ware erro" });
        return;
    
    }
}
module.exports={isValid:validate,isAuth:auth}