"use strict";
const {MongoClient, ObjectId, ObjectID} = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri, {useUnifiedTopology: true,});

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
    const res = await db
        .collection(collection)
        .findOneAndUpdate(condition, {$set: data}, {returnOriginal: false});
    console.log(res);
    return res;
}

async function findAll(collection, condition) {
    const db = await getInstance();
    const res = await db.collection(collection).find().toArray();
    return res;
}

async function getUser(id) {
    const db = await getInstance();
    const res = await db.collection("users").findOne({_id: ObjectId(id)});
    return res;
}

/**
 * Creates new Board
 * @param {String} name Board Name
 * @param {String} description Board Description
 * @param {ObjectId} user_id User Id
 */
async function addBoard(name, description, user_id) {
    const db = await getInstance();
    const res = await db.collection("boards").insertOne({
        name: name,
        description: description,
        members: [{user_id: ObjectId(user_id), role: "owner"}],
    });
    return res;
}

/**
 * Returns an array of boards that user is a member of
 * @param {String} user User ID
 */
async function getUserBoards(user) {
    const db = await getInstance();
    const res = await db
        .collection("boards")
        .find({members: {$elemMatch: {user_id: ObjectId(user)}}})
        .toArray();
    return res;
}
async function getBoardLists(board,user){
    const db = await getInstance();
    const res= await db.collection("lists").find({board_id: ObjectId(board)}).toArray()
    return res;
}

/**
 * Returns Specfic Board
 * @param {String} user User ID
 * @param {String} board Board ID
 */
async function getUserBoard(user, board) {
    const db = await getInstance();
    if (!user) {
        const res = await db.collection("boards").findOne({_id: ObjectId(board)});
        
        return res;
    }
    const res = await db.collection("boards").findOne({
        $and: [
            {members: {$elemMatch: {user_id: ObjectId(user)}}},
            {_id: ObjectId(board)},
        ],
    });
    return res;
}

/**
 * Updates Board if User is Owner or Editor
 * @param {String} user User ID
 * @param {String} board Board ID
 * @param {Object} data Data To Update
 */
async function updateBoard(user, board, data) {
    const db = await getInstance();
    const res = await db.collection("boards").findOneAndUpdate(
        {
            $and: [
                {_id: ObjectId(board)},
                {"members.user_id": ObjectId(user)},
                {"members.role": {$ne: "member"}},
            ],
        },
        {$set: data},
        {returnOriginal: false}
    );
    return res;
}

async function insertList(name, board_id) {

    const db = await getInstance();
    const objectid = new ObjectID();
    const res2 = await db.collection('boards').findOneAndUpdate({_id: ObjectId(board_id)},{$push:{lists:{_id:ObjectId(objectid)}}});
    if (!res2.lastErrorObject.updatedExisting) {
        console.error("error in update board");
        return;
    }
    const res = await db.collection('lists').insertOne({
        _id: ObjectId(objectid),
        name: name,
        archived: false,
        disabled: false,
        board_id: ObjectId(board_id)
    },)
    if (res.result.n!=1) {
        console.error("error in insertList");
        return;
    }
    return res;

}
async function editList(list_id,name){
    const db=await getInstance();
    const res=await db.collection("lists").findOneAndUpdate({_id: ObjectId(list_id)},{$set:{name:name}});
    return res;
}
async function getLists(){
    const db = await getInstance();
    const res=await db.collection("lists").find().toArray();
    return res;
}
async function getListssTasks(listid){
    const db = await getInstance();
    const res = await db.collection("tasks").find({idList:ObjectId(listid)}).toArray();
    return res;
}
async function getonelist(list_id){
    const db = await getInstance();
    const res=await db.collection("lists").findOne({_id: ObjectId(list_id)})
    return res;
}
async function removelist(list_id){
    try {
        const db = await getInstance();
        const res= await db.collection("lists").deleteOne({_id: ObjectId(list_id)});
        return res;
    }
    catch (e){
        console.error(e);
    }

}
async function getOneTask(task_id){

    try {
        const db = await getInstance();
        if(!task_id){
            const res=await db.collection("tasks").find().toArray();
            return res;
        }
        const res=await db.collection("tasks").findOne({_id: ObjectId(task_id)})
        return res;
    }
    catch (e){
        console.error(e)
    }
}
async function addTask(data){
    try {
        const db = await getInstance();
        const res = await db.collection("tasks").insertOne(data);
        return res;
    }
    catch (e){
        console.error(e);
    }
}
async function deleteBoard(data) {
    try {
        const db = await getInstance();
        const res = await db.collection("boards").deleteOne({_id: ObjectId(data)})
        return res;
    }
    catch (e)
    {
        console.error(e)
    }
    
}

module.exports = {
    insertOne,
    findOne,
    updateOne,
    findAll,
    addBoard,
    getUserBoards,
    getUserBoard,
    updateBoard,
    getUser,
    insertList,
    editList,
    getLists,
    getonelist,
    removelist,
    getOneTask,
    addTask,
    getBoardLists,
    getListssTasks,
    deleteBoard
};
