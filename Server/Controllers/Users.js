const User = require("../Models/User");
const bcrypt = require("bcrypt");
const error = require("../utils/error");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const saltRounds = process.env.SALT_ROUNDS;
function ValidateEmail(mail) 
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    return (false)
}

const checkLogin = async (req, res) => {
    return res.status(200).json({status:"ok",userId:req.headers.userId});
}
const userLogin = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      return res.status(403).json(error(0, "username or password is missing"));
    }
    User.findOne({ username: username }).then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        let aToken = jwt.sign(
          { userId: user._id, isAdmin: user.isAdmin },
          process.env.SECRET,
          {
            expiresIn: "30min",
          }
        );
        let rToken = jwt.sign(
          { userId: user._id, isAdmin: user.isAdmin },
          process.env.SECRET,
          {
            expiresIn: "24h",
          }
        );
        user.rToken=rToken;
        user.save()
        console.log(aToken)
        return res
          .status(201)
          .json({"status":"success",aToken:aToken,rToken:rToken});
      } else {
        return res
          .status(403)
          .json(error(1, "user not found or password is wrong"));
      }
    }).catch(err => {console.log("hellaweawe")});
  } catch (err) {
    console.log("hello");
  }
};

const userRegister = async (req, res) => {
  if(!ValidateEmail(req.body.email)){
    return res.status(403).json(error(1, "email is invalid"));
  }

  User.findOne({ email: req.body.email }).then(async (user) => {

    if (user) {
      console.log(user.username)
      if(user.username==req.body.username){
        return res.status(403).json(error(1, "user with this username exists"));
      }
      res.status(403).json(error(1, "user with this email exists"));
      return;
    } else {
      const salt = await bcrypt.genSalt(+saltRounds); //Genrates random salt
      const hash = bcrypt.hashSync(req.body.password, salt);
      let msg = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        isAdmin: false,
      });

      msg.save().then((doc) => {
        console.log(doc)
        return res.status(200).json(error(0));
      });
    }
  });
};

const refreshToken= async (req, res) => {
  
  try {
    jwt.verify(req.body.rToken, process.env.SECRET)
    }catch{
      return res
      .status(403)
      .json(error(1, "refresh token is expired"));
    }
    const user = await User.findOne({rToken:req.body.rToken})
    if(!user){
      return res
      .status(403)
      .json(error(1, "refresh token is invalid"));
    }
  if(req.body.rToken==user.rToken){
    let aToken = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.SECRET,
      {
        expiresIn: "30min",
      }
    );
    let rToken = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.SECRET,
      {
        expiresIn: "24h",
      }
    );
    user.rToken=rToken;
    user.save()
    console.log(aToken)
    return res
      .status(201)
      .json({"status":"success",aToken:aToken,rToken:rToken});
  }else{
    return res
    .status(403)
    .json(error(1, "refresh token is expired"));
  }
}

const checkUser = async (req, res) => {
  return res.status(200).json(req.headers.userId)
};

module.exports = { userRegister, userLogin,checkUser ,refreshToken ,checkLogin};
