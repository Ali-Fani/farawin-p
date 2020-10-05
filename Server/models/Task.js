const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Task=new Schema({
    taskId:{type:Schema.Types.ObjectId,unique:true},
    name:String,
    desc:String,
    creation_data:{ type: Date, default: Date.now },
    update_data:{ type: Date, default: Date.now },
    due_date:Date,
    members:[{type:Schema.Types.ObjectId,ref:"User"}],
    activiys:[{type:Schema.Types.ObjectId,ref: "Comment"}]

})
module.exports=mongoose.model("Task",Task);