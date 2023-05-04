"use strict";

var _express = require("express");
var _user = require("../controllers/user.controllers");
var router = (0, _express.Router)();

// Post que guarda datos del usuario de fb al iniciar sesion
router.post('/users', _user.userFB);