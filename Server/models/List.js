const mongoose=require("mongoose");
const List=new Schema({
    listId:{type:Schema.Types.ObjectId,unique:true},
    name:String,
    boardId:{type: Schema.Types.ObjectId, ref: 'Board'},
    tasks:[{type: Schema.Types.ObjectId, ref: 'Task'}],

});
module.exports=mongoose.model('List',List);