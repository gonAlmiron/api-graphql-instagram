"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserModel = void 0;
var _mongoose = require("mongoose");
var UserSchema = new _mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  profileIg: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});
var UserModel = (0, _mongoose.model)('user', UserSchema);
exports.UserModel = UserModel;