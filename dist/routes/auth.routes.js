"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _auth = require("../controllers/auth.controllers");
var router = (0, _express.Router)();
router.get('/code', _auth.captureCode);
router.post('/token', _auth.getToken);
router.get('/data', _auth.getDataIg);
var _default = router;
exports["default"] = _default;