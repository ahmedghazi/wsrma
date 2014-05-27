var mongoose = require('mongoose');
var Vote = mongoose.Schema({
    facebookId: {
        type: String,
        index: true
    },
    createdAt: {type: Date, default: Date.now},
    ip: String
});
module.exports = Vote;