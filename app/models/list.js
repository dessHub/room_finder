
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listSchema = mongoose.Schema({

        category    :{
          type : String
        } ,
        title     : {
          type : String
        },
        location     : {
          type : String
        },
        info    : {
          type : String
        },
        image : {
          type : String
        },
        status : {
          type : String
        },
        date    : {
          type : Date
        },
        user :{
            type : Schema.Types.ObjectId, ref: "User",
            unique: "true"
        }

});

// methods ======================

// create the model for rooms and expose it to our app
var List = module.exports = mongoose.model('List', listSchema);
