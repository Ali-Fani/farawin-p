const {getOneTask,addTask} =require("../utils/db");
const {ObjectId} = require("mongodb");
const getTasks = async (req,res) => {
    try{
        const id=req.params.id;
        const response=await getOneTask(id);
        console.log(response)
        res.json(response);
        return;
    }
    catch (e){
        console.error(e);
    }


}
const newTask=async(req, res) =>{
    try {
        const name=req.body.name;
        const desc=req.body.desc;
        const idList=req.body.idList;
        const response = await addTask({name:name,desc:desc,idList:ObjectId(idList)})
        res.json(response);
        return;


    }catch (e){
        console.error(e);
    }
}
module.exports={getTasks,newTask}