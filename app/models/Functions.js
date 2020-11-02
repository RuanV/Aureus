  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var bcrypt = require('bcrypt-nodejs');
  var titlize = require('mongoose-title-case');
  var validate = require('mongoose-validator')

  

  var Schema = new Schema({
      name: { type: String, required: true },
      icon: { type: String, required: false },
      functionheader: { type: String, required: true },
      page: { type: Number, required: true },
      scriptpath: { type: String, required: true },
      controller: { type: String, required: true}
  });



  module.exports = mongoose.model('Functions', Schema);