var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BoardMemberSchema = new Schema(
  {
    boardId: {type: Schema.Types.ObjectId, ref: 'Board',required:true},
    userId: {type: Schema.Types.ObjectId, ref: 'User',required:true},
    userRole: {type: String}

  }
);

//Export model
module.exports = mongoose.model('BoardMember', BoardMemberSchema);