type : String
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({

  phoneno :{
    type : String,
    index : true
  },
  name :{
    type : String
  },
  email : {
    type :  String
  },
  role :{
    type :  String
  },
  status :{
    type :  String
  },
  title :{
    type : String
  },
  description : {
    type :  String
  },
  regNo :{
    type :  String
  },
  logo :{
    type : String
  },
  location : {
    type :  String
  },
  website :{
    type :  String
  },
  postcode :{
    type :  String
  },
  password : {
    type : String
  }

});

var User = module.exports = mongoose.model('User', UserSchema);
module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10,function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}
module.exports.getUserByUsername= function(username, callback){
  var query = {phoneno: username};
  User.findOne(query, callback);
}
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
  });
}
