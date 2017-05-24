const base64url = require('base64url');
const multer = require('multer');
const fs = require('fs');
const pictures = multer({});
var Product = require('../models/product');
var User = require('../models/user');

module.exports = {

    // =====================================
    index: (req, res)=> {

      User.find({}, (err, accounts)=>{
        if(err) throw err;

        res.render('client/home.ejs', {accounts:accounts});
     });
   },

    accounts: (req, res) =>{
    //eval(require('locus'));
        if (req.query.location) {
          console.log("query search exist")
           const regex = new RegExp(escapeRegex(req.query.location), 'gi');
           User.find({ location: regex }, function(err, foundads) {
               if(err) {
                   console.log(err);
               } else {
                  res.render("client/listings.ejs", { accounts: foundads });
               }
           });
         }else{
        User.find({}, function(err, accounts){
          if(err) throw err;

          res.render('client/listings.ejs', {accounts:accounts});
        })
      }
    },

    categories: (req, res)=>{

      var cate = req.params.cat;
      User.find({"category":cate}, function(err, lists){
        if(err) throw err;

        res.render('client/listings.ejs', {accounts:lists});
      })


    },

    // =====================================
    account: (req, res)=>{
      User.find({"_id":req.params.id}, function(err, list){
        if(err) return err;

        var cat = "";
        var user = "";
        for(i=0; i<list.length; i++){
          cat = list[i].category;
        }
        User.find({"category":cat}, function(err, cat){
          if(err) throw err;

          Product.find({user:req.params.id}, function(err, products){
            if (err) return err;

            res.render("client/list.ejs", {list:list, cat:cat, products:products});
          });

        });

      });
    },

    addproduct: (req, res)=>{
      var id = req.user.id;
      var note = req.body.note;
      var image = req.image;
      var tmp_path = req.file.path;

      /** The original name of the uploaded file
         stored in the variable "originalname". **/
      var target_path = 'uploads/' + req.file.originalname;
      /** A better way to copy the uploaded file. **/
      var src = fs.createReadStream(tmp_path);
      var dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      fs.unlink(tmp_path); //deleting the tmp_path


         var product = new Product();
         product.user = id;
         product.image = target_path;
         product.note = note;

         product.save(function(err, product){
           if(err) return err;

           console.log("success");

           req.flash('success_msg', "Image uploaded");
           res.redirect('/mylist');
         })

    },

     updateAccount: (req,res)=>{
       var location = req.body.location;
       var category = req.body.category;
       var title = req.body.title;
       var description = req.body.description;
       var regNo = req.body.regNo;
       var website = req.body.website;
       var postcode = req.body.postcode;
       var phoneno = req.body.phoneno;
       var name = req.body.name;
       var email = req.body.email;

       var id = req.params.id;
       console.log(id);

       var user = new User();
       user._id = id;

       user.update({location:location,
         category:category,
         title : title,
         description:description,
         regNo:regNo,
         name:name,
         email:email,
         postcode:postcode,
         website:website,
         phoneno:phoneno},function(err, user){
         if(err) return err;

         console.log("Success")
         res.redirect('/mylist')
         delete req.session.returnTo;
       })
     },

     deleteAccount: (req, res)=>{
       User.remove({"_id":req.params.id},function(err, account){
           if(err) return err;

           res.redirect('/');
         })
     },


};

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
