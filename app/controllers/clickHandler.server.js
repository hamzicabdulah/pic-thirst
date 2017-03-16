'use strict';

var Users = require('../models/users.js');
var Images = require('../models/images.js');

function ClickHandler () {
    
    this.getPics =  function (req, res) {
        Images.find({}).exec(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    };
    
    this.checkUser = function (req, res) {
        Images.find({postedId: req.params.userId}).exec(function (err, result) {
            if (err) throw err;
            if (req.user && req.user.socialId === req.params.userId || result.length > 0) {
                if (req.isAuthenticated()) 
                    res.sendFile(process.cwd() + '/public/index-logged.html');
                else
                    res.sendFile(process.cwd() + '/public/index.html');
            }
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
            posted: req.user.displayName,
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
                if (result.likes.indexOf(req.user.displayName) < 0) {
                    Images.findByIdAndUpdate(req.params.id, {$push: {likes: req.user.displayName}}, {new: true})
                    .exec(function (err, result2) {
                        if (err) throw err;
                        res.json(result2);
                    }); 
                } else {
                    Images.findByIdAndUpdate(req.params.id, {$pull: {likes: req.user.displayName}}, {new: true})
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