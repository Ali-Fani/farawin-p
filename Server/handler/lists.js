const { insertList }=require('../utils/db')
const createList=async (req,res) => {
    const name=req.body.name;
    const board_id=req.body.board_id;
    const inserted=await insertList(name, board_id)
    if (!inserted){
        res.status(400).json({status: 'Failed'})
    }
    res.json(inserted)
    return;

}
module.exports={createList}