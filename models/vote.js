var mongoose = require('mongoose');
var Vote = require('../config/schemas/vote');
module.exports = mongoose.model('Vote', Vote);