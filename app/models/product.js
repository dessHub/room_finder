
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = mongoose.Schema({

        image : {
          type : String
        },
        note : {
          type : String
        },
        user   : {
          type : Schema.Types.ObjectId, ref: "User"
        }

});

// methods ======================

// create the model for rooms and expose it to our app
var Product = module.exports = mongoose.model('Product', productSchema);
