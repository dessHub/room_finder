const base64url = require('base64url');
const multer = require('multer');
const fs = require('fs');
const pictures = multer({});
const express        = require('express');
const router         = express.Router();
const homeRoutes     = require('./home');
const authRoutes     = require('./auth');

var upload = multer({ dest: 'uploads/' });

module.exports = (app, passport)=> {

/*=====================================================
     Home Routes
  =====================================================*/
app.get('/', homeRoutes.index);
app.get('/accounts', homeRoutes.accounts);
app.get('/list:cat', homeRoutes.categories);
app.get('/clist:id', homeRoutes.account);
app.post('/addproduct', upload.single('image'), homeRoutes.addproduct);
app.post('/update:id', homeRoutes.updateAccount);
app.get('/delete/account:id', isLoggedIn, homeRoutes.deleteAccount);

/*=====================================================
     Auth Routes
  =====================================================*/
 app.get('/log', authRoutes.log);
 app.post('/signup', upload.single('image'), authRoutes.create);
 app.post('/login', authRoutes.login);
 app.get('/mylist', isLoggedIn, authRoutes.mylist);
 app.get('/myaccount', authRoutes.myaccount);
 app.get('/use', authRoutes.use);
 app.get('/role/:phoneno/:role', authRoutes.roles);
 app.get('/logout', authRoutes.logout);

}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/myaccount');
    req.session.returnTo;
}
