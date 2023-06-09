"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _auth = _interopRequireDefault(require("./auth.routes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// import instagramRouter from './instagram.routes'

var router = (0, _express.Router)();

// router.use('/ig', instagramRouter)

router.use('/auth', _auth["default"]);
router.get('/', function (req, res) {
  res.send('HOLA');
});
var _default = router;
exports["default"] = _default;