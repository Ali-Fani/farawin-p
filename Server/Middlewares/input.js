var ObjectId = require("mongoose").Types.ObjectId;
const error = require("../utils/error");

// const input = (req, res, next) => {
//     if(req.method=="POST" || req.method=="PUT" || req.method=="Delete" ){
//         let boardId=req.body.boardId;
//         if(boardId && ObjectId.isValid(boardId))
//         {
//             next();
//         }else{
//             return res.status(403).json(error(1,"missing or invalid board id"))
//         }
//     }else if(req.method == "GET")
//     {
//         let boardId=req.params.boardId;
//         if(boardId && ObjectId.isValid(boardId))
//         {
//             next();
//         }else{
//             return res.status(403).json(error(1,"missing or invalid board id"))
//         }
//     }
//   };
function HasRole(input) {
    return function(req, res, next) {
        if(req.method=="POST" || req.method=="PUT" || req.method=="DELETE" ){
            let boardId=req.body[input] || req.params[input];
            if(boardId && ObjectId.isValid(boardId))
            {

                next();
            }else{
                return res.status(403).json(error(1,`missing or invalid ${input}`))
            }
        }else if(req.method == "GET")
        {
            let boardId=req.params[input];
            if(boardId && ObjectId.isValid(boardId))
            {
                next();
            }else{
                return res.status(403).json(error(1,`missing or invalid ${input}`))
            }
        }
    }
  }
module.exports ={validBoardId:HasRole}