'use strict';

var path = process.cwd();

var MainHandler = require(path + '/app/controllers/mainHandler.server.js');

module.exports = function (app, passport) {
    
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    }

    var mainHandler = new MainHandler();

    app.route('/')
        .get(function (req, res) {
            if (req.isAuthenticated()) {
                res.sendFile(path + '/public/index-logged.html');
            } else {
                res.sendFile(path + '/public/index.html');
            }
        });
        
    app.route('/logout')
        .get(function (req, res) {
            req.logout();
            res.redirect('/');
        });
        
    app.route('/api/pics')
        .get(mainHandler.getPics)
        .post(isLoggedIn, mainHandler.postPic);
        
    app.route('/api/pic/:id')
        .delete(mainHandler.removePic);
        
    app.route('/api/current-user')
        .get(function (req, res)  {
            if (req.isAuthenticated()) {
                res.json(req.user);
            } else {
                res.send(false);    
            }
        });
        
    app.route('/:userId')
        .get(mainHandler.checkUser);
    
    app.route('/api/:userId')
        .get(mainHandler.getUserPics);
        
    app.route('/api/like/:id')
        .post(mainHandler.like);

    app.route('/auth/github')
        .get(passport.authenticate('github'));
        
    app.route('/auth/github/callback')
        .get(passport.authenticate('github', {
            successRedirect: '/',
            failureRedirect: '/'
        }));
        
    app.route('/auth/twitter')
        .get(passport.authenticate('twitter'));
        
    app.route('/auth/twitter/callback')
        .get(passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/'
        }));
        
    app.route('/auth/facebook')
        .get(passport.authenticate('facebook'));
        
    app.route('/auth/facebook/callback')
        .get(passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/'
        }));
        
    app.route('*')
    .get(function(req, res) {
      res.redirect('/');
    });
};