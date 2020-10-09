"use strict";
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { findAll, findOne, insertOne,getUser } = require("../utils/db");
const { jwTokenGen,genHash } = require("../utils/utils");

const login = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await findOne("users", { username: username });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const tokens = await jwTokenGen(user);
        res.cookie("refresh_token", tokens.refresh_token, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true,
        });
        res
          .status(202)
          .json({ status: "succes", access_token: tokens.access_token });
        return;
      }
    }
    res.status(403).json({ status: "username or password is wrong" });
    return;
  } catch (err) {
    console.error(err);
  }
};
const register = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const emailaddress = req.body.email;
    const exists = await findOne("users", { username: username });
    if (!exists) {
      const hashed_password=await genHash(password);
      if(hashed_password){
        insertOne("users", {
              fname: firstname,
              lname: lastname,
              email: emailaddress,
              username: username,
              password: hashed_password,
              isAdmin: false,
            })
              .then((resault) => {
                if (resault.insertedCount) {
                  res.status(201).json({ status: "success" });
                  return;
                }
              })
              .catch((err) => {
                res.status(400).json(err);
                return;
              });
      }
    } else {
      res.json({ status: "username already exists" });
      return;
    }
  } catch (err) {
    console.error(err);
  }
};
const check = async (req, res) => {
  const user=await getUser(req.body.user)
  res.json(user);
  return;
};
const getUsers = async (req, res) => {
  const user_id = req.params.user_id;
  const isAdmin=req.headers.isAdmin;
  if(!isAdmin){
    res.status(403).json({status:"failed",error:"you need admin access for this action"});
    return;
  }
  if (!user_id) {
    const users = await findAll("users");
    users.forEach(user => {
      delete user.password;
      delete user.refresh_token
    });
    console.log(users);
    res.json(users);
    return;
  }
  const user=await getUser(user_id);
  delete user.password;
  delete user.refresh_token;
  res.json(user);
  return;
};
const refresh_token = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      console.error("token not found");
      res.status(401).json({ success: false });
      return;
    }
    const user = await findOne("users", { refresh_token: token });
    if (!user) {
      console.error("token is not valid");
      res.status(401).json({ success: false, error: "token is not valid" });
      return;
    }


    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded) {
      console.error("token is not valid");
      res.status(401).json({ success: false, error: "token is not valid" });
      return;
    }
    const tokens = await jwTokenGen(user);
    res.cookie("refresh_token", tokens.refresh_token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    res
      .status(202)
      .json({ status: "succes", access_token: tokens.access_token });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};
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

module.exports = { login, register, check, refresh_token, getUsers };
