const { insertList,editList,getLists,getonelist,removelist,getListsTasks }=require('../utils/db')
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
const updateList=async (req, res)=>{
    const id=req.params.id
    if(!id)
    {
        res.status(400).json({status: 'Failed',error:"list ID is Missing"});
        return;
    }
    const name=req.body.name
    const result = await editList(id,name)
    if (!result)
    {
        res.status(400).json({status: 'Failed'});
        return;
    }
    res.json(result)
    return;
}
const showLists=async(req, res) =>{
    const id=req.params.id
    if (id)
    {
        const list= await getonelist(id);
        if(!list)
        {
            res.status(404).json({status: 'Failed',error:"list not found"})
        }
        res.json(list);
        return;
    }
    const lists=await getLists();
    if(!lists)
    {
        res.status(400).json({status:"failed"})
        return;
    }
    res.json(lists);
    return;
}
const deleteList=async (req, res) =>{
    const id=req.body.id
    if(!id){
        res.status(400).json({status: 'Failed',error: "list id is missing"})
    }
    const result = await removelist(id)
    if (!result)
    {
        res.status(400).json({status: 'Failed'})
        return;
    }
    res.json(result);
    return;
}
const getListTasks= async (req, res) => {
    console.log(req.params)
    const id=req.params.id
    if (!id)
    {
        res.status(400).json(
            { status: 'Failed' }
        )
        return;
    }
    const tasks=await getListsTasks(id);
    if (tasks) {
        res.json(tasks)
        return;
    }
    res.status(400).json({status: 'Failed'})
    
}
module.exports={createList,updateList,showLists,deleteList,getListTasks}