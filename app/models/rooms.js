
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = mongoose.Schema({

        category    :{
          type : String
        } ,
        room_no     : {
          type : String
        },
        plot_no    : {
          type : String
        },
        location     : {
          type : String
        },
        info    : {
          type : String
        },
        price     : {
          type : String
        },
        phoneno    : {
          type : String
        },
        image : {
          type : String
        },
        status : {
          type : String
        },
        user     : {
          type : Schema.Types.ObjectId, ref: "User"
        }

});

// methods ======================

// create the model for rooms and expose it to our app
var Room = module.exports = mongoose.model('Room', roomSchema);
