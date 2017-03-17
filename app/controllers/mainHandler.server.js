'use strict';

var Images = require('../models/images.js');

function ClickHandler () {
    
    this.getPics =  function (req, res) {
        Images.find({}).exec(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    };
    
    this.checkUser = function (req, res) {
        //Check whether a user exists before requesting all of that user's posts
        Images.find({postedId: req.params.userId}).exec(function (err, result) {
            if (err) throw err;
            if (req.user && req.user.socialId === req.params.userId || result.length > 0) {
                //If the user is requesting his own posts or if the requested user really exists, then send the posts to the user
                if (req.isAuthenticated()) 
                    res.sendFile(process.cwd() + '/public/index-logged.html');
                else
                    res.sendFile(process.cwd() + '/public/index.html');
            }
            //Else, redirect the user to the home page
            else res.redirect('/');
        });
    };
    
    this.getUserPics = function (req,  res) {
        Images.find({postedId: req.params.userId}).exec(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    };
    
    this.postPic = function (req, res) {
        var image = new Images({
            url: req.body.url,
            title: req.body.title,
            posted: req.user.username,
            postedId: req.user.socialId,
            likes: []
        });
        image.save(function (err, doc) {
            if (err) throw err;
            res.redirect('/');
        });
    };
    
    this.removePic = function (req, res) {
        Images.findByIdAndRemove(req.params.id)
        .exec(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    };
    
    this.like = function (req, res) {
        Images.findById(req.params.id)
        .exec(function (err, result) {
            if (err) throw err;
            if (req.isAuthenticated()) {
                //If the user doesn't already like the pic, add his like to the database, else, remove it
                if (result.likes.indexOf(req.user.socialId) < 0) {
                    Images.findByIdAndUpdate(req.params.id, {$push: {likes: req.user.socialId}}, {new: true})
                    .exec(function (err, result2) {
                        if (err) throw err;
                        res.json(result2);
                    }); 
                } else {
                    Images.findByIdAndUpdate(req.params.id, {$pull: {likes: req.user.socialId}}, {new: true})
                    .exec(function (err, result2) {
                        if (err) throw err;
                        res.json(result2);
                    }); 
                }    
            }
            else res.json(result);
        });
    };
    
}

module.exports = ClickHandler;