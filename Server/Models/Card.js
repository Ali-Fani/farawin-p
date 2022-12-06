var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CardSchema = new Schema(
  {
    cardName: {type: String,required: true},
    cardDescription: {type: String},
    cardDueDate: {type: String},
    boardId:  {type: Schema.Types.ObjectId, ref: 'Board',required:true},
    listId:  {type: Schema.Types.ObjectId, ref: 'List',required:true},
  }
);

//Export model
module.exports = mongoose.model('Card', CardSchema);