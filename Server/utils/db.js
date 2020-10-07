"use strict";
const { MongoClient, ObjectId } = require("mongodb");
const { use } = require("../route");
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
async function updateOne(collection, condition, data) {
    const db = await getInstance();
    const res = await db.collection(collection).findOneAndUpdate(condition, { $set: data }, { returnOriginal: false })
    console.log(res)
    return res;
}
async function findAll(collection, condition) {
    const db = await getInstance();
    const res = await db.collection(collection).find(condition).toArray()
    return res;
}

async function deleteOne(collection, condition) {
    const db = await getInstance();
    const res = await db.collection(collection).deleteOne(condition);
    return res;
}
async function getBoardMebers(board) {
    const db = await getInstance();
    const res = await db.collection("boardMembers").find({ _id: ObjectId(board) }).toArray()
    return res;
}
async function addBoardMember(board, userid, role) {
    const db = await getInstance();
    const res = await db.collection("boardMembers").insertOne({ board_id: board, user_id: userid, role: role })
    return res;
}
async function addBoard(name, description, user_id) {
    const db = await getInstance();
    const res = await db.collection("boards").insertOne({ name: name, description: description, members: [{ user_id: ObjectId(user_id), role: "owner" }] })
    return res;
}

async function getUserBoards(user) {
    // db.boards.find({members:[ObjectId("5f7d619ab0f00b2bef3550a4")]})
    const db = await getInstance();
    const res = await db.collection("boards").find({ members: {$elemMatch: { user_id:ObjectId(user) }} }).toArray()
    console.log(res)
    return res;
}
module.exports = { insertOne, findOne, updateOne, findAll, addBoardMember, addBoard, getUserBoards };
