const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Board=new Schema({
    boardId:{type:Schema.Types.ObjectId,unique:true},
    name:String,
    admin:{type: Schema.Types.ObjectId, ref: 'User'},
    lists:[{type:Schema.Types.ObjectId,ref:"List"}],

})
module.exports=mongoose.model('Board',Board);