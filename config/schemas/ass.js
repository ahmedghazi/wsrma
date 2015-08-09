var mongoose = require('mongoose');

var Ass = mongoose.Schema({
	//index: true,
    date_created: {
    	index: true,
    	type: Date, default: Date.now
    },
    img: {
    	unique: true, 
    	index: true,
    	type: String
    },
    ratings: {
    	index: true,
    	type: Array
    },
    average: {
    	index: true,
    	type: Number
    }
}, {
    //versionKey: false
});

module.exports = Ass;
