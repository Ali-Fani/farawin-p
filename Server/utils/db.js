"use strict";
const e = require("express");
const uri = "mongodb://127.0.0.1:27017";
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useUnifiedTopology: true ,useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
const User=require("../models/User")

async function getInstance() {
    if (!db) {
        db = await initDB();
        //2: await initDB()
    }
    return db;
}
async function check_user(username, password) {
    try {
        const data=await User.findOne({username:username,password:password})
        if(data){
            return data;
        }
        else{
            return;
        }
        
    }
    catch (err) {
        console.error(err);
    }
}
async function insert(collect, object) {
    const db = await getInstance();
    const users = db.collection(collect);
    const resault = await users.insertOne(object);
    if (!ok) {
        res.status(500).json({ success: false });
        return;
    }
}

module.exports = { getInstance ,check_user};