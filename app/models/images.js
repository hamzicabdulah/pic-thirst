'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
    url: String,
    title: String,
    posted: String,
    postedId: String,
    likes: Array
});

module.exports = mongoose.model('Image', Image);