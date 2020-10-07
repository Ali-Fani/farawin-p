const router = require("express").Router();
const user = require("./handler/users");
const board = require("./handler/boards");
const {isValid,isAuth,}=require("./middlewares");

//user
router.post(
  "/auth/login",
  isValid,
  user.login
);
router.post("/auth/register",isValid, user.register);
router.post("/auth/refresh-token", user.refresh_token);
router.post("/auth/check",isAuth, user.check);

//board
router.post("/board", isAuth, board.create_board);
router.get("/board/:id?", isAuth, board.list_boards);
router.patch("/board  ", isAuth, board.update_boards);
router.delete("/board", isAuth, board.delete_boards);

module.exports = router;
