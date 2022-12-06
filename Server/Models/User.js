var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    fname: {type: String},
    lname: {type: String},
    email: {type: String, required:true},
    username: {type: String, required:true},
    password: {type: String, required:true},
    rToken: {type: String},
    isAdmin: {type: Boolean, required:true}

  }
);

//Export model
module.exports = mongoose.model('User', UserSchema);