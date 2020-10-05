const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const User = new Schema({
    id:{type:Schema.Types.ObjectId,unique:true},
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        validate:{
            validator:function(v){
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
            
        }
    },
    sessions:String,
    password:{
        type:String,
        validate:{
            validator:function(v)
            {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v)
            },message: props => `Password should be Minimum eight characters, at least one uppercase letter, one lowercase letter and one number`
        }
    },
    isAdmin:Boolean,
    boards:[
        {type:Schema.Types.ObjectId,ref:"Board"}
    ]
  });
  User.path('email').validate(function(value, done) {
    this.model('User').count({ email: value }, function(err, count) {
        if (err) {
            return done(err);
        } 
        // If `count` is greater than zero, "invalidate"
        done(!count);
    });
}, 'Email already exists');

module.exports=mongoose.model("User",User)