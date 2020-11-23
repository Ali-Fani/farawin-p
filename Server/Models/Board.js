var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BoardSchema = new Schema(
  {
    boardName: {type: String , required: true},
    boardDesc: {type: String},

  }
);

//Export model
module.exports = mongoose.model('Board', BoardSchema);