var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CardMembersSchema = new Schema(
  {
    cardId:  {type: Schema.Types.ObjectId, ref: 'Card',required:true},
    userId: {type: Schema.Types.ObjectId, ref: 'User',required:true},
  }
);

//Export model
module.exports = mongoose.model('CardMember', CardMembersSchema);