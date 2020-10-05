"use strict";
const jwt = require("jsonwebtoken");
const { ObjectID } = require("mongodb");
const { getInstance ,check_user} = require("../utils/db");
const { check_data } = require("../utils/data-validation");

const login = async (req,res)=>{
  try{
      const username=req.body.username;
      const password=req.body.password;
      const validate=await check_data(username,password);
      console.log(validate);
      if(validate!=true){
        res.json(validate);
        return;
      }
      const checked=await check_user(username,password);
      console.log(checked);
      if (checked) {
        res.json(checked);
      }
      else{
        res.status(403).json({error:"username or password is wrong"})
      }
  }catch(err){
    console.error(err);
  }
};
const register = async(req,res)=>{
  try{
    const username=req.body.username;
    const password=req.body.password;
    const validate=await check_data(username,password);
    console.log(validate);
    if(validate!=true){
      res.status(403).json(validate);
      return;
    }
    const checked = await check_user(username,password);
    if(checked){
      res.json(checked)
    }
    else{
      console.log(checked);
      res.status(403).json({error:"username or password is wrong"})
    }
  }catch(err){
    console.error(err);
  }
}
// 
// const login = async (req, res) => {
  // try {
    // if (!req.body.username) {
      // res.status(400).json({ success: false, error: "missing username" });
      // return;
    // }
    // if (req.body.username.length < 3) {
      // res.status(400).json({ success: false, error: "invalid username" });
      // return;
    // }
    // if (!req.body.pass || req.body.pass.length < 8) {
      // res.status(400).json({ success: false, error: "invalid pass" });
      // return;
    // }
    // const db = await getInstance();
    // const users = db.collection("users");
    // const user = await users.findOne({
      // username: req.body.username,
      // pass: req.body.pass,
    // });
    // if (!user) {
      // res.status(403).json({ success: false });
      // return;
    // }
    // const resp = await generateToken(user._id);
    // res.set("Set-Cookie", `refresh_token=${resp.refresh_token}`)
    // res.json(resp);
  // } catch (err) {
    // console.log(err);
    // res.status(500).json({ success: false });
  // }
// };

module.exports={login,register};