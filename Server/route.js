const router = require("express").Router();
const user = require("./handler/users");
const board = require("./handler/boards");
const list=require("./handler/lists")
const task=require("./handler/tasks")
const {isValid,isAuth,listValid}=require("./middlewares");

//user
router.post(
  "/auth/login",
  isValid,
  user.login
);
router.post("/auth/register",isValid, user.register);
router.post("/auth/refresh-token", user.refresh_token);
router.post("/auth/check",isAuth, user.check);
router.get("/auth/users/:user_id?",isAuth,user.getUsers)

//board
router.post("/board", isAuth, board.create_board);
router.get("/board/:id?", isAuth, board.list_boards);
router.get("/board/:id/lists", isAuth, board.boards_lists);
router.patch("/board", isAuth, board.update_boards);
router.delete("/board", isAuth, board.delete_boards);

router.post("/list",isAuth,listValid,list.createList);
router.patch("/list/:id",isAuth,list.updateList);
router.get("/list/:id?",isAuth,list.showLists);
router.delete("/list",isAuth,list.deleteList);
router.get("/list/:id/tasks",isAuth,list.getListTasks)

router.get("/task",isAuth,task.getTasks);
router.post("/task",isAuth,task.newTask);
// router.patch("")
module.exports = router;
