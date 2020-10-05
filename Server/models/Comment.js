const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Comment=new Schema({
    commentId:Schema.Types.ObjectId,
    authr:{type: Schema.Types.ObjectId, ref: 'User'},
    Task:{type: Schema.Types.ObjectId, ref: 'Task'},
    comment:String,
})
module.exports=mongoose.model('Comment',Comment)