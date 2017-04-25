var Room = require('../models/rooms');
var Album = require('../models/album');
var List = require('../models/list');

module.exports = function(app, passport) {

    // =====================================
    app.get('/', function(req, res) {

      Room.find({}, function(err, rooms){
        if(err) throw err;

        res.render('client/home.ejs', {rooms:rooms});
      })

    });

    app.get('/ads', function(req, res){
    //eval(require('locus'));
      if (req.query.location) {
        console.log("query search exist")
         const regex = new RegExp(escapeRegex(req.query.location), 'gi');
         Room.find({ location: regex }, function(err, foundads) {
             if(err) {
                 console.log(err);
             } else {
                res.render("client/vacant.ejs", { rooms: foundads });
             }
         });
       }else{
      Room.find({}, function(err, rooms){
        if(err) throw err;

        res.render('client/vacant.ejs', {rooms:rooms});
      })
    }

    });

   app.get('/fuzzy', function(req, res){
     console.log(req.query.search)
     console.log("query search exist")
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      Room.find({ location: regex }, function(err, foundads) {
          if(err) {
              console.log(err);
          } else {
             res.render("client/vacant.ejs", { rooms: foundads });
          }
      });
   })

    app.get('/client-ads', function(req, res){
      Room.find({user:req.user.id}, function(err, rooms){
        if(err) throw err;

        res.render('client/client-ads.ejs', {rooms:rooms});
      })

    });

    app.get('/add-ads', isLoggedIn,function(req, res){

        res.render('client/add-ads.ejs');

    });

    app.get('/add-list', isLoggedIn,function(req, res){

        res.render('client/add-list.ejs');

    });

    app.get('/list', function(req, res){
      List.find({}, function(err, lists){
        if(err) throw err;

        res.render('client/listings.ejs', {rooms:lists});
      })

    })

    app.get('/tobe', function(req, res){
      Room.find({"status":"To Be Vacant"}, function(err, rooms){
        if(err) throw err;

        res.render('client/vacant.ejs', {rooms:rooms});
      })
    })

    app.get('/clroom:id', function(req, res){
      Room.find({"_id":req.params.id}, function(err, room){
        if(err) return err;

         var cat = "";
         for(i=0; i<room.length; i++){
           cat = room[i].category;
         }

        Album.find({"room":req.params.id}, function(err, album){
          if(err) return err;

           Room.find({"category":cat}, function(err, cat){
             if(err) return err;

             res.render("client/room.ejs", {room:room, album:album, cat:cat});
           })

        })

      })
    });
    // =====================================
    app.get('/profile', isLoggedIn, function(req, res) {

        res.render('admin/index.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });


};

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
