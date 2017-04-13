
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumSchema = mongoose.Schema({

        image : {
          type : String
        },
        room     : {
          type : Schema.Types.ObjectId, ref: "Room"
        }

});

// methods ======================

// create the model for rooms and expose it to our app
var Album = module.exports = mongoose.model('Album', albumSchema);
