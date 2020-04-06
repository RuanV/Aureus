  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var bcrypt = require('bcrypt-nodejs');
  var titlize = require('mongoose-title-case');
  var validate = require('mongoose-validator')

  var nameValidator = [
      validate({
          validator: 'matches',
          arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
          message: 'Must at least be 3 characters,max 30, no special characters or numbers and space between name(Example: Jake White)'
      }),
      validate({
          validator: 'isLength',
          arguments: [3, 25],
          message: 'Name cant be less than 3 and longer than 30 Characters'
      })
  ];

  var ContactSchema = new Schema({
      email: { type: String, required: true},
      name: { type: String, required: true},
      maincellnumber: { type: String, required: true},
      altcellnumber: { type: String, required: true},
      address: { type: String, required: false},
      bank: { type: String, required: false},
      bankbranch: { type: String, required: false },
      bankaccount: { type: Number, required: false}
  });

  

  module.exports = mongoose.model('Contact', ContactSchema);