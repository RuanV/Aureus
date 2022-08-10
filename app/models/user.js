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
  var emailValidator = [
      validate({
          validator: 'isEmail',
          arguments: [3, 50],
          message: 'Not a Valid Email'
      }),
      validate({
          validator: 'isLength',
          arguments: [3, 30],
          message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
      }),
  ];
  var userNameValidator = [
      validate({
          validator: 'isAlphanumeric',
          arguments: [3, 30],
          message: 'UserName Must contain Letters'
      })
  ];

  var passwordValidator = [
      validate({
          validator: 'matches',
          arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\w]).{8,30}$/,
          message: 'Password needs to have more than 8 characters, one lowercase,one uppercase and one special characters'
      })
  ];

  var UserSchema = new Schema({
      name: { type: String, lowercase: true, required: true, validate: nameValidator },
      username: { type: String, lowercase: true, required: true, unique: true },
      password: { type: String, required: true, validate: passwordValidator },
      email: { type: String, lowercase: true, required: true, unique: true },
      permission: { type: String, required: true, default: 'user' }
  });

  UserSchema.pre('save', function(next) {
      var user = this;
      bcrypt.hash(user.password, null, null, function(err, hash) {
          user.password = hash;
          next();
      })
  });

  UserSchema.plugin(titlize, {
      paths: ['name']
  });

  UserSchema.methods.comparePassword = function(password) {
      return bcrypt.compareSync(password, this.password);
  }

  module.exports = mongoose.model('User', UserSchema);