var mongoose = require('mongoose');
//var forms = require('forms');

var Ass = mongoose.Schema({
    ass_id: {
        unique: true,
        type: String,
        index: true
    },
    date_created: {
        type: Date
    },
    img: {
    	unique: true,
        type: String
    },
    ratings: {
        type: String
    }

}, {
    //versionKey: false
});
module.exports = Ass;
//ass_id,date_created,img,ratings