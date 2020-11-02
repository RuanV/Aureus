  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var bcrypt = require('bcrypt-nodejs');
  var titlize = require('mongoose-title-case');
  var validate = require('mongoose-validator')

  

  var thisSchema = new Schema({
      name: { type: String, required: true },
      icon: { type: String, required: true }
  });



  module.exports = mongoose.model('FunctionHeaders', thisSchema);