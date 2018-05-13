'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dogsSchema = _mongoose2.default.Schema({
  firstName: { type: String },
  lastName: { type: String },
  bio: { type: String },
  avatar: { type: String },
  account: {
    type: _mongoose2.default.Schema.ObjectId,
    // Do I need an Account before I can create a Profile?
    required: true,
    // Can an account have more than one profile?
    unique: true // this is setting a 1-1
  }
});

exports.default = _mongoose2.default.model('dogs', dogsSchema);