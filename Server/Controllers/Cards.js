const Card = require("../Models/Card");
const List=require("../models/List");
const BoardMember = require("../Models/BoardMember")
const CardMember = require("../Models/CardMember")
const error = require("../utils/error");

async function validateBoardMember(boardId,userId,manager=false,res){
    const mainRoles=["owner","editor"];
    if(manager){
        const access = await BoardMember.findOne({boardId:boardId,userId:userId,userRole:{$in:mainRoles}})
        
        if(!access){
            return false
        }
        return true;
    }else{
        const access = await BoardMember.findOne({boardId:boardId,userId:userId});
        console.log(!access)
        if(!access){
            return false
        }
        console.log("manager")
        return true;
    }

}

const createCard = async (req, res) => {
    if(!validateBoardMember(req.body.boardId,req.headers.userId,true,res)){
        return res.status(403).json(error(1,"user dont have access to this board"))
    }
    else{
        if(!req.body.cardName)
        {
            return res.status(403).json(error(1,"card name missing"))
        }
        const checkList=await List.findOne({boardId:req.body.boardId,_id:req.body.listId});
        if(!checkList){
            return res.status(403).json(error(1,"wrong boardid and / or listId"))
        }
        const newCard = new Card({
            boardId:req.body.boardId,
            listId:req.body.listId,
            cardDescription:req.body.cardDescription,
            cardName:req.body.cardName
        })
        newCard.save().then((doc) => {
            // const newCardMember = new CardMember({
            //     cardId:doc._id,
            //     userId:req.headers.userId
            // })
            // newCardMember.save()
            return res.status(201).json(error(0,doc))
        
        })
        
    }
    
}


const readListCards=async (req, res) => {
    const listId=req.params.listId;
    const listdata=await List.findById(listId)
    if(!validateBoardMember(listdata.boardId,req.headers.userId,false,res)){
        return res.status(403).json(error(1,"user dont have access to this board"))
    }
    const listCards= await Card.find({listId:listId})
    if(listCards.length < 1)
    {
        return res.status(403).json(error(1,"no Cards in this list"))
    }
    return res.status(201).json(listCards);
}

const readCardData= async (req, res) => {
    const cardId=req.params.cardId;
    const cardData=await Card.findById(cardId)
    if(!cardData)
    {
        return res.status(403).json(error(1,"Card Not found"))
    }
    else
    {
        if(!validateBoardMember(cardData.boardId,req.headers.userId,false,res)){
            return res.status(403).json(error(1,"user dont have access to this board"))
        }
        return res.status(201).json(error(0,cardData))
    }
}

const updateCardData = async (req,res) => {
    const cardId=req.params.cardId;
    const cardData=await Card.findById(cardId)
    if(!cardData)
    {
        return res.status(403).json(error(1,"Card Not found"))
    }
    else
    {
        if(!validateBoardMember(cardData.boardId,req.headers.userId,false,res)){
            return res.status(403).json(error(1,"user dont have access to this board"))
        }
        if(!req.body.cardName){
            return res.status(403).json(error(1,"cardName is missing"))
        }
        cardData.cardName=req.body.cardName;
        if(req.body.cardDesc){cardData.cardDescription=req.body.cardDesc}
        cardData.save().then(doc => {return res.status(201).json(error(0,cardData))})
        
    }
}

const deleteCard = async (req,res) => {
    const cardData= await Card.findById(req.params.cardId)
    
    if(!cardData)
    {
        return res.status(403).json(error(1,"Card Not found"))
    }
    else
    {
        if(!validateBoardMember(cardData.boardId,req.headers.userId,false,res)){
            return res.status(403).json(error(1,"user dont have access to this board"))
        }
        const cardMemberData=await CardMember.findOne({cardId:cardData._id,userId:req.headers.userId})
        if(!cardMemberData)
        {
            return res.status(403).json(error(1,"you dont have access to this card"))
        }
        cardData.remove().then(doc1=>{
            cardMemberData.remove().then(doc2=>{return res.status(201).json(error(0,doc1))})
        })
        
    }
}

const addCardMember = async (req,res) => {
    const cardData=await Card.findById(req.params.cardId)
    if(!cardData){
        return res.status(403).json(error(1,"Card with this id not found"))
    }
    
    if(!validateBoardMember(cardData.boardId,req.headers.userId,true,res) ||
    !validateBoardMember(cardData.boardId,req.body.userId,false,res)){
        return res.status(403).json(error(1,"user dont have access to this board"))
    }
    console.log("second one ran")
    const cardMember=await CardMember.findOne({cardId:cardData._id,userId:req.body.userId})
    if(cardMember){
        return res.status(403).json(error(1,"user is already this cards member"))
    }
    const newCardMember = CardMember({
        cardId:cardData._id,
        userId:req.body.userId
    })
    newCardMember.save().then((err,doc)=>{
        if(!err){return res.status(201).json(error(0,doc))}else{
            console.log("yani chi nina :|")
            return res.status(403).json(error(1,err))
        }
        
    })
}

const deleteCardMember = async (req,res) => {
    const cardData=await Card.findById(req.params.cardId)
    if(!cardData){
        return res.status(403).json(error(1,"Card with this id not found"))
    }
    if(!validateBoardMember(cardData.boardId,req.headers.userId,true,res)){
        return res.status(403).json(error(1,"user dont have access to this board"))
    }
    const isCardMember=await CardMember.findOne({userId:req.body.userId,cardId:cardData._id})
    if(!isCardMember){
        return res.status(403).json(error(1,"user is not this cards member"))
    }
    isCardMember.remove()
    return res.status(201).json(error(0,"cardMember removed"))
}

const readCardMembers = async (req,res) => {
    const cardData=await Card.findById(req.params.cardId)
    if(!cardData){
        return res.status(403).json(error(1,"Card with this id not found"))
    }
    
    if(!validateBoardMember(cardData.boardId,req.headers.userId,false,res)){
        return res.status(403).json(error(1,"user dont have access to this board"))
    }
    const cardMembers= await CardMember.find({cardId:cardData._id})
    if(!cardMembers || cardMembers.length <1)
    {
        return res.status(403).json(error(1,"no card members"))
    }
    return res.status(201).json(error(0,cardMembers))

}

module.exports = {createCard,readListCards,readCardData,updateCardData,deleteCard,addCardMember,deleteCardMember,readCardMembers}