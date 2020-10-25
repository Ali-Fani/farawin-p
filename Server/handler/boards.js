require("dotenv").config();

const { ObjectID, ObjectId } = require("mongodb");
const { use } = require("../route");
const {
  findOne,
  insertOne,
  findAll,
  updateOne,
  addBoardMember,
  getBoardLists,
  addBoard,
  getUserBoards,
  getUserBoard,
  updateBoard,
  getUser,
  deleteBoard,
  getListssTasks
} = require("../utils/db");
const create_board = async (req, res) => {
  try {
    const name = req.body.name;
    console.log(name)
    if(!name || name.length<3)
    {
      res.status(401).json({status: "failure",error: "board name is required"})
    }
    const description = req.body.description;
    const user = await findOne("users", { _id: ObjectID(req.body.user) });
    const board = await addBoard(name, description, user._id);
    if (board.insertedCount > 0) {
      res.json(board.ops[0]);
      return;
    }
    res.status(401).json({ status: "failure" });
  } catch (err) {
    console.error(err);
    res.status(401).json({ status: "failure" });
    return;
  }
};
const list_boards = async (req, res) => {
  try {
    const id = req.params.id;
    const user_id = req.headers["user"];
    const user = await getUser(user_id);

    if (!id) {
      if (!user.isAdmin) {
        const boards = await getUserBoards(user._id);
        res.json(boards);
        return;
      }
      const boards = await findAll("boards");
      res.json(boards);
      return;
    }
    if (!user.isAdmin) {
      const boards = await getUserBoard(user._id, id);
      res.json(boards);
      return;
    }
    const boards = await getUserBoard(id);
    res.statusMessage ="Updated"

    res.json(boards);
    return;

    // if (!boards) {
    //   res.status(403).json({
    //     status: "failure",
    //     error: "you dont have access to this board",
    //   });
    //   return;
    // }
    // res.json(boards);
    // return;
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: "failure", error: err.message });
    return;
  }
};
const boards_lists = async(req, res)=>{
  const board_id=req.params.id
  const boards_lists= await getBoardLists(board_id)
  for (let i in boards_lists)
  {
      const tasks=await getListssTasks(boards_lists[i]._id);
      boards_lists[i]['tasks']=tasks
      console.log(boards_lists[i])
  }
  res.json(boards_lists)
  return;
}
const update_boards = async (req, res) => {
  try {
    const board_id = req.body._id;
    const name = req.body.name;
    const description = req.body.description;
    const board=await updateBoard(req.body.user,board_id,{name:name,description: description});
    if(!board.lastErrorObject.updatedExisting){
      res.status(403).json({status: "failure",error:"either board not found or you dont have access to update it"});
      return;
    }
    res.statusMessage ="Updated"
    res.json(board.value);
    return;
  } catch (err) {
    console.error(err);
    return;
  }
};
const delete_boards = async (req, res) => {
  try {
    const board_id = req.body.id;
    if (!board_id){
      res.status(400).json({status: "failure"})
    }
    const resp=await deleteBoard(board_id)
    res.json(resp);
    return
  } catch (err) {
    console.error(err)
  }
};
module.exports = { create_board, list_boards, update_boards, delete_boards,boards_lists };
