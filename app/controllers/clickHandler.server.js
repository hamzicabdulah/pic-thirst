'use strict';

var Users = require('../models/users.js');
var Images = require('../models/images.js');

function ClickHandler () {
    
    this.getPics =  function (req, res) {
        Images.find({}, {'_id': false}).exec(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    };
    
    this.checkUser = function (req, res) {
        Images.find({posted: req.params.user}, {'_id': false}).exec(function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                if (req.isAuthenticated()) 
                    res.sendFile(process.cwd() + '/public/index.html');
                else
                    res.sendFile(process.cwd() + '/public/login.html');
            }
            else res.redirect('/');
        });
    };
    
    this.getUserPics = function (req,  res) {
        Images.find({posted: req.params.user}, {'_id': false}).exec(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    };
    
    this.postPic = function (req, res) {
        var image = new Images({
            url: req.body.url,
            title: req.body.title,
            posted: req.user.github.displayName,
            likes: []
        });
        image.save(function (err, doc) {
            if (err) throw err;
            res.redirect('/login');
        });
    };
    
    this.removePic = function (req, res) {
        Images.findOneAndRemove({title: req.params.title})
        .exec(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    };
    
    this.like = function (req, res) {
        Images.findOne({title: req.params.title}, { '_id': false })
        .exec(function (err, result) {
            if (err) throw err;
            if (req.isAuthenticated()) {
                if (result.likes.indexOf(req.user.github.displayName) < 0) {
                    Images.findOneAndUpdate({title: req.params.title}, {$push: {likes: req.user.github.displayName}}, {new: true})
                    .exec(function (err, result2) {
                        if (err) throw err;
                        res.json(result2);
                    }); 
                } else {
                    Images.findOneAndUpdate({title: req.params.title}, {$pull: {likes: req.user.github.displayName}}, {new: true})
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