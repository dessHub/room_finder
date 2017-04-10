module.exports = function(app, passport) {

    // =====================================
    app.get('/profile', isLoggedIn, function(req, res) {

      console.log(req.user);
        res.render('admin/index.ejs', {
            user : req.user // get the user out of session and pass to template

        });
    });

    // =====================================
    app.get('/admin-vacant', function(req, res) {
        res.render('admin/rooms.ejs'); // load the index.ejs file
    });

    // =====================================
    app.get('/admin-tobe', function(req, res) {
        res.render('admin/rooms.ejs'); // load the index.ejs file
    });

    // =====================================
    app.get('/admin-occupied', function(req, res) {
        res.render('admin/rooms.ejs'); // load the index.ejs file
    });

    // =====================================
    app.get('/admin-all', function(req, res) {
        res.render('admin/rooms.ejs'); // load the index.ejs file
    });

    // =====================================
    app.get('/admin-add', function(req, res) {
        res.render('admin/add.ejs'); // load the index.ejs file
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
