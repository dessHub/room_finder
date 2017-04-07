module.exports = function(app, passport) {

    // =====================================
    app.get('/', function(req, res) {
        res.render('client/index.ejs'); // load the index.ejs file
    });

    app.get('/vacant', function(req, res){
      res.render('client/vacant.ejs');
    })

    app.get('/tobe', function(req, res){
      res.render('client/vacant.ejs');
    })

    // =====================================
    app.get('/profile', isLoggedIn, function(req, res) {

      console.log(req.user);
        res.render('admin/index.ejs', {
            user : req.user // get the user out of session and pass to template

        });
    });


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
