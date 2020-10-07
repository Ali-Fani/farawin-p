"use strict";
const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri, { useUnifiedTopology: true });

let db;
async function initDB() {
  try {
    await client.connect();
    const newDB = client.db("farawin-p");
    return newDB;
    //2: db = client.db("farawin")
  } catch (err) {
    console.error(err);
  }
}

async function getInstance() {
  if (!db) {
    db = await initDB();
  }
  return db;
}
async function insertOne(collection, dataToInsert) {
  const db = await getInstance();
  const res = await db.collection(collection).insertOne(dataToInsert);
  return res;
}
async function findOne(collection, condition) {
    const db = await getInstance();
    const res = await db.collection(collection).findOne(condition);
    return res;
  }
async function updateOne(collection,condition,data){
    const db=await getInstance();
    const res=await db.collection(collection).findOneAndUpdate(condition,{$set: data},{returnOriginal:false})
    console.log(res)
    return res;
}
async function findAll(collection,condition){
  const db = await getInstance();
  const res=await db.collection(collection).find(condition).toArray()
  return res;
}

async function deleteOne(collection,condition){
  const db = await getInstance();
  const res = await db.collection(collection).deleteOne(condition);
  return res;
}
  
module.exports = { insertOne,findOne,updateOne,findAll };
