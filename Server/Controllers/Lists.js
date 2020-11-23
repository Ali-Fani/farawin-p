const User = require("../Models/User");
const List=require("../models/List")
const BoardMember = require("../Models/BoardMember");
const mainRoles=["owner","editor"];
const Card = require("../Models/Card");
var ObjectId = require("mongoose").Types.ObjectId;
const error = require("../utils/error");

const createList = async (req, res) => {
    const boardId=req.body.boardId;
    const listName=req.body.listName;
    if(!listName){
        return res.status(403).json(error(1,"missing list name"))
    }
    const boardAccess= await BoardMember.findOne({boardId:boardId,userId:req.headers.userId,userRole:{$in:mainRoles}})
    if(!boardAccess){
        return res.status(403).json(error(1,"you dont have permission to edit this board"))
    }
    const newlist=new List({
        listName:listName,
        boardId:boardId
    })
    newlist.save().then(doc=>{
        return res.status(201).json(error(0,doc))
    })

}

const readBoardLists = async (req, res) => {
    const boardId=req.params.boardId;
    const checkAuth= await BoardMember.findOne({boardId:boardId,userId:req.headers.userId})
    if(!checkAuth){
        return res.status(403).json(error(1,"you are not a member of this board"))
    }
    const boardLists=await List.find({boardId:boardId})
    const listTasks= boardLists.map(item=>{
         Card.find({listId:item._id}).then(doc=>{
            console.log(doc)
         })
        
    })
    return res.status(201).json(error(0,boardLists.length <1 ? [{}] : boardLists))
}

const updateBoardList = async (req, res) => {
    const listId=req.body.listId;
    const listName=req.body.listName;
    if(!listName || listName.length <3)
    {
        return res.status(403).json(error(1,"list name missing or to short"))
    }
    const list= await List.findById(listId)
    const boardAccess= await BoardMember.findOne({boardId:list.boardId,userId:req.headers.userId})
    if(!boardAccess)
    {
        return res.status(403).json(error(1,"you dont have access to this board"))
    }
    list.listName=listName
    list.save().then((doc) => {return res.status(201).json(error(0,doc))})
    
}

const deleteBoardList = async (req,res) => {
    const listId=req.body.listId;
    const list= await List.findById(listId)
    if(!list){
        return res.status(403).json(error(1,"list with this id not found"))
    }
    const boardAccess= await BoardMember.findOne({boardId:list.boardId,userId:req.headers.userId})
    console.log(listId)
    if(!boardAccess)
    {
        return res.status(403).json(error(1,"you dont have access to this board"))
    }
    list.remove().then((doc)=>{return res.status(201).json(error(0,doc))})

}


module.exports={createList, readBoardLists,updateBoardList, deleteBoardList}