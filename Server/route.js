const router= require("express").Router();
const User=require("./Controllers/Users");
const Board=require("./Controllers/Boards")
const List=require("./Controllers/Lists")
const Cards=require("./Controllers/Cards")
const {isAuth} = require("./Middlewares/auth")
const {validBoardId} = require("./Middlewares/input")

router.post('/login',User.userLogin)
router.post('/register',User.userRegister)
router.get('/user',isAuth,User.checkUser)
router.post('/refreshToken',User.refreshToken)
router.get('/check',isAuth,User.checkLogin)


router.post('/board',[isAuth],Board.createBoard)
router.get('/board/:boardId?',isAuth,Board.getUserBoards)
router.put('/board',[isAuth,validBoardId('boardId')],Board.editUserBoard)
router.delete('/board',[isAuth,validBoardId('boardId')],Board.deleteBoard)

router.post("/board/members",[isAuth,validBoardId('boardId'),validBoardId('userId')],Board.addBoardMember)
router.get("/board/:boardId/members",[isAuth,validBoardId('boardId')],Board.getBoardMembers)
router.delete("/board/members",[isAuth,validBoardId('boardMemberId')],Board.deleteBoardMember)

router.post("/list",[isAuth,validBoardId('boardId')],List.createList)
router.get("/board/:boardId/lists",[isAuth,validBoardId('boardId')],List.readBoardLists)
router.put("/list",[isAuth,validBoardId('listId')],List.updateBoardList)
router.delete("/list",[isAuth,validBoardId('listId')],List.deleteBoardList)
router.get("/list/:listId/cards",[isAuth,validBoardId('listId')],Cards.readListCards)

router.post("/cards",[isAuth,validBoardId('boardId'),validBoardId("listId")],Cards.createCard)
router.get("/cards/:cardId",[isAuth,validBoardId('cardId')],Cards.readCardData)
router.put("/cards/:cardId",[isAuth,validBoardId('cardId')],Cards.updateCardData)
router.delete("/cards/:cardId",[isAuth,validBoardId('cardId')],Cards.deleteCard)
router.post("/cards/:cardId/idMembers",[isAuth,validBoardId('cardId'),validBoardId('userId'),],Cards.addCardMember)
router.get("/cards/:cardId/idMembers",[isAuth,validBoardId('cardId')],Cards.readCardMembers)
router.delete("/cards/:cardId/idMembers",[isAuth,validBoardId('cardId'),validBoardId('userId')],Cards.deleteCardMember)
module.exports = router;