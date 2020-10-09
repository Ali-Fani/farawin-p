const router = require("express").Router();
const user = require("./handler/users");
const board = require("./handler/boards");
const list=require("./handler/lists")
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
router.patch("/board", isAuth, board.update_boards);
router.delete("/board", isAuth, board.delete_boards);

router.post("/list",isAuth,listValid,list.createList);
module.exports = router;
