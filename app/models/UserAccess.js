  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var bcrypt = require('bcrypt-nodejs');
  var titlize = require('mongoose-title-case');
  var validate = require('mongoose-validator')

  

  var Schema = new Schema({
      name: { type: String, required: true },
      access: { type: Array, required: false }
  });



  module.exports = mongoose.model('UserAccess', Schema);