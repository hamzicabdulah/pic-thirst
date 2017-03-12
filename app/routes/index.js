'use strict';

var path = process.cwd();

var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {
    
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }

    var clickHandler = new ClickHandler();

    app.route('/')
        .get(isLoggedIn, function (req, res) {
            res.sendFile(path + '/public/index.html');
        });
        
    app.route('/login')
        .get(function (req, res) {
            if (req.isAuthenticated()) {
                res.redirect('/');
            } 
            res.sendFile(path + '/public/login.html');
        });
        
    app.route('/logout')
        .get(function (req, res) {
            req.logout();
            res.redirect('/login');
        });
        
    app.route('/api/pics')
        .get(clickHandler.getPics)
        .post(isLoggedIn, clickHandler.postPic);
        
    app.route('/my-pics')
        .get(isLoggedIn, function (req, res) {
            res.sendFile(process.cwd() + '/public/my-pics.html');
        });
        
    app.route('/api/mypics')
        .get(clickHandler.getMyPics);
        
    app.route('/api/like/:title')
        .post(clickHandler.like);

    app.route('/auth/github')
        .get(passport.authenticate('github'));
        
    app.route('/auth/github/callback')
        .get(passport.authenticate('github', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));
        
    app.route('/api/current-user')
        .get(function (req, res)  {
            if (req.isAuthenticated()) {
                res.json(req.user.github);
            } else {
                res.send(false);    
            }
        });
};