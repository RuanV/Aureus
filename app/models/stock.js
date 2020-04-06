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

  var StockSchema = new Schema({
      name: { type: String, required: true},
      description: { type: String, required: false},
      model: { type: String, required: false},
      price: { type: Number, required: true},
      category: { type: String, required: true},
      sold: { type: Boolean, required: true, default: false },
      soldFor: { type: Number, required: false,default: 0  },
      boughtFor: { type: Number, required: false,default: 0  },
      media: { type: [String], required: true },
      dateCreated:{ type: String, default: new Date()}
  });

  

  module.exports = mongoose.model('Stock', StockSchema);