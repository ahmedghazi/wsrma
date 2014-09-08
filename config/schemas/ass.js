var mongoose = require('mongoose');

var Ass = mongoose.Schema({
    date_created: {type: Date, default: Date.now},
    img: {unique: true, type: String},
    ratings: {type: Array},
    average: {type: Number}
}, {
    //versionKey: false
});

module.exports = Ass;
