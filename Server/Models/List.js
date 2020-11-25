var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ListSchema = new Schema(
  {
    listName: {type: String,required:true},
    boardId:  {type: Schema.Types.ObjectId, ref: 'Board',required:true},
    cards:[{type: Schema.Types.ObjectId , ref: 'Card'}]

  }
);

//Export model
module.exports = mongoose.model('List', ListSchema);