var mongoose = require('mongoose');
var Ass = require('../config/schemas/ass');
module.exports = mongoose.model('Ass', Ass);