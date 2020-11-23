const Board = require("../Models/Board");
const error = require("../utils/error");
const BoardMember = require("../Models/BoardMember");
var ObjectId = require("mongoose").Types.ObjectId;
const mainRoles=["owner","editor"];
const createBoard = async (req, res) => {
  if (!req.body.boardName || req.body.boardName.length < 3) {
    return res.status(403).json(error(1, "Board Name is missing or too short"));
  }
  const board = new Board({
    boardName: req.body.boardName,
    boardDesc: req.body.boardDesc,
  });
  board.save().then((doc) => {
    let BMember = new BoardMember({
      boardId: doc._id,
      userId: req.headers.userId,
      userRole: "owner",
    });
    BMember.save().catch((e) => {
      console.log(e);
    });
    return res.status(201).json(doc);
  });
};


const getUserBoards = async (req, res) => {
  if (req.headers.isAdmin) {
    const all = await Board.find();
    return res.json(all);
  } else {
    const userBoardMembers = await BoardMember.find({
      userId: req.headers.userId,
    });
    var ids = userBoardMembers.map((doc) => {
      return doc.boardId;
    });
    const userBoards = await Board.find({ _id: { $in: ids } }).lean();
    const getuserBoardsRoles = async item => {
      let role= await BoardMember.findOne({boardId:item._id,userId:req.headers.userId})
      item["role"]=role.userRole;
      return item

    }
    
    const getData = async () => {
      return Promise.all(userBoards.map(item => getuserBoardsRoles(item)))
    }
    await getData()
    console.log(userBoards)
    return res.status(201).json(userBoards);
  }
};


const editUserBoard = async (req, res) => {
  const boardId = req.body.boardId;
  const boardName = req.body.boardName;
  const boardDesc = req.body.boardDesc;
  const boardMember = await BoardMember.findOne({boardId:boardId,userId:req.headers.userId,userRole:{$in:mainRoles}})
  console.log(boardMember)
  if(!boardMember)
  {
    return res.status(403).json(error(1,"you dont have permission to edit this board!"));
  }
  else
  {
    try {
        const update = await Board.findByIdAndUpdate(boardId, {
          boardName: boardName,
          boardDesc: boardDesc,
        },{new:true});
        return res.status(202).json(error(0,update));
      } catch (error) {
        return res.status(403).json(error.message);
      }
  }


  
};


const deleteBoard = async (req, res) => {
    const boardId=req.body.boardId;
    const userId=req.headers.userId;


        const boardMember=await BoardMember.find({boardId:boardId,userId:userId});
        if(!boardMember || boardMember.userRole != "owner"){
            return res.status(403).json(error(1,"insufficient permission"));
        }
        
        const deletedBoard= await Board.deleteOne({_id:boardId})
        const deletedBoardMembers = await BoardMember.deleteMany({boardId:boardId})
        return res.status(200).json(error(0,[deletedBoard,deletedBoardMembers]))
    
}


const addBoardMember = async (req, res) => {
    const boardId=req.body.boardId;
    const newuserId=req.body.userId;
    const boardUserRel=await BoardMember.findOne({boardId:boardId,userId:req.headers.userId,userRole:"owner"})
    if(!boardUserRel)
    {
        return res.status(403).json(error(1,"you dont have permission to edit this board!"));
    }
    const boardMemberExists = await BoardMember.find({boardId:boardId,userId:newuserId})
    console.log(boardMemberExists)
    console.log(req.headers.userId)
    if(boardMemberExists.length >0)
    {
        return res.status(403).json(error(1,"user is already a board member"));
    }
    const newBoardMember=new BoardMember({
        boardId:boardId,
        userId:newuserId,
        userRole:req.body.userRole || "member"
    })
    newBoardMember.save().then(doc => {
        return res.status(201).json(error(0,doc))
    }).catch(err => {
        return res.status(500).json(error(1,err.message))
    })

}
const getBoardMembers = async (req, res) => {
    const boardId=req.params.boardId;
    const bMemebers= await BoardMember.find({boardId:boardId});
    return res.status(201).json(bMemebers)
}
const deleteBoardMember = async (req,res) => {
    let boardMember=await BoardMember.findById(req.body.boardMemberId)
    // const permision=await BoardMember.findOne({boardId:boardMember.boardId,userId:req.headers.userId,userRole:"owner"})
    if(boardMember.userId != req.headers.userId || boardMember.userRole !="owner")
    {
        console.log(req.headers.userId)
        return res.status(403).json(error(1,"insufficient permission"))
    }
    BoardMember.deleteOne({_id:boardMember._id}).then(result =>{return res.status(200).json(result)})
}
const editBoardMemberRole = async (req, res) => {
    return res.send("wow2")
}
module.exports = { createBoard, getUserBoards, editUserBoard, deleteBoard, addBoardMember,getBoardMembers,deleteBoardMember};
