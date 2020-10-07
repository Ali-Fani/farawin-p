require("dotenv").config();

const { ObjectID } = require("mongodb");
const { findOne, insertOne, findAll, updateOne } = require("../utils/db");
const create_board = async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const due_date = req.body.due_date;
    const type = req.body.type;
    const user = await findOne("users", { _id: ObjectID(req.body.user) });
    insertOne("boards", {
      name: name,
      description: description,
      type: type,
      due_date: due_date,

      members: [user._id],
    })
      .then((result) => {
        if (result.insertedCount) {
          res.status(201).json({ status: "success" });
          return;
        }
      })
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: "failure" });
    return;
  }
};
const list_boards = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.headers.user;
    if (!id) {
      const boards = await findAll("boards", { members: [ObjectID(user)] });
      res.json(boards);
      return;
    }

    const boards = await findOne("boards", {
      members: [ObjectID(user)],
      _id: ObjectID(id),
    });
    if (!boards) {
      res.status(403).json({
        status: "failure",
        error: "you dont have access to this board",
      });
      return;
    }
    res.json(boards);
    return;
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: "failure" });
    return;
  }
};

const update_boards = async (req, res) => {
  try {
    const board_id = req.body._id;
    const name = req.body.name;
    const description = req.body.description;
    const board = await updateOne(
      "boards",
      { $and: [{ members: [ObjectID(req.body.user)] }, { _id: ObjectID(board_id) }] },
      { name: name, description: description }
    );
    console.log(board)
    if (board.lastErrorObject.n) {
      res.status(200).json({ status: "success", data: board.value });
      return;
    }
    res.status(401).json({ status: "failure" });
  } catch (err) {
    console.error(err);
    return;
  }
};
const delete_boards = async (req, res) => {
  try {
      const {id:board_id,user:user_id}=req.body;
      res.json({board_id:board_id,user_id:user_id});
  } catch (err) {}
};
module.exports = { create_board, list_boards, update_boards,delete_boards };
