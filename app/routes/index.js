'use strict';

var path = process.cwd();

var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {
    
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    }

    var clickHandler = new ClickHandler();

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
        .get(clickHandler.getPics)
        .post(isLoggedIn, clickHandler.postPic);
        
    app.route('/api/pic/:id')
        .delete(clickHandler.removePic);
        
    app.route('/api/current-user')
        .get(function (req, res)  {
            if (req.isAuthenticated()) {
                res.json(req.user);
            } else {
                res.send({redirect: '/'});    
            }
        });
        
    app.route('/:userId')
        .get(clickHandler.checkUser);
    
    app.route('/api/:userId')
        .get(clickHandler.getUserPics);
        
    app.route('/api/like/:id')
        .post(clickHandler.like);

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
};