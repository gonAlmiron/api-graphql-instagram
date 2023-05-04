"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireWildcard(require("express"));
var _routes = _interopRequireDefault(require("../routes"));
var _connectMongo = _interopRequireDefault(require("connect-mongo"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _config = _interopRequireDefault(require("../config"));
var _passport = _interopRequireDefault(require("passport"));
var _passportInstagram = _interopRequireDefault(require("passport-instagram"));
var _passportFacebook = _interopRequireDefault(require("passport-facebook"));
var _user = require("../models/user");
var _https = _interopRequireDefault(require("https"));
var _fs = _interopRequireDefault(require("fs"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _cors = _interopRequireDefault(require("cors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
_dotenv["default"].config();
var app = (0, _express["default"])();
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"].json());
app.use((0, _cors["default"])());

// Cert. SSL
var httpsServerOptions = {
  key: _fs["default"].readFileSync(process.env.KEY_PATH),
  cert: _fs["default"].readFileSync(process.env.CERT_PATH)
};
var serverHttps = _https["default"].createServer(httpsServerOptions, app);
serverHttps.listen(process.env.HTTPS_PORT, function () {
  console.log("Escuchando en el puerto ".concat(process.env.HTTPS_PORT));
});

// CONFIGURACION SESSIONS DEL USUARIO
var ttlSeconds = 6000;
var StoreOptions = {
  store: _connectMongo["default"].create({
    mongoUrl: _config["default"].MONGO_ATLAS_URI,
    crypto: {
      secret: 'squirrel'
    }
  }),
  secret: 'shhhhhh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: ttlSeconds
  }
};
app.use((0, _expressSession["default"])(StoreOptions));
var mySecret = 'mySecret';
app.use((0, _cookieParser["default"])(mySecret));
app.use('/api', _routes["default"]);

// ---------- Inicialización Passport ------------------- 

_passport["default"].serializeUser(function (user, done) {
  done(null, user);
});
_passport["default"].deserializeUser(function (user, done) {
  done(null, user);
});
app.use(_passport["default"].initialize());
app.use(_passport["default"].session());

// ---------------------   PASSPORT INSTAGRAM ------------------------ API GRAPH VISUALIZACION BASICA DE INSTAGRAM -------------------------------------------- 

var accessToken = 'EAADSzpbdiTABALFhaoAZC12W8sn2085XubkTzRVC5qxHxwcqAuPcoK3Oa17ZAYHajVIdBThZALEjkgYKQEPSQlpQ0jd0ELz28r4S9DrAQdsZCfK8cXpiPZClGtRLjxIPHYSh1uC1AgsQ1ZB3hfGf8dgCOV6zoR7iPZCSNMtyREHllQ622lpVV2n8mlGYI6TbaaPBws765VZAcwZDZD';
_passport["default"].use(new _passportInstagram["default"]({
  clientID: '180895391557997',
  clientSecret: 'b45df1e98fe84fceb1924f7c451a584e',
  callbackURL: 'https://localhost:443/auth/instagram/callback'
}, function (accessToken, refreshToken, profile, done) {
  var data = {
    token: accessToken,
    profileIg: profile
  };
  _user.UserModel.create(data);
  return done(null, profile);
}));

// Iniciar sesión con Instagram
app.get('/auth/instagram', _passport["default"].authenticate('instagram'));
app.get('/auth/instagram/callback', _passport["default"].authenticate('instagram', {
  failureRedirect: '/'
}), function (req, res) {
  res.redirect('/');
});
app.get('/profile', isAuthenticated, function (req, res) {
  res.json({
    user: req.user
  });
});
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// ---------------------   PASSPORT FACEBOOK --------------------------------------------------------------------

_passport["default"].use(new _passportFacebook["default"]({
  clientID: '231784736196912',
  clientSecret: '1e5e97c03d88f4826283eb2fd7e501cb',
  callbackURL: "https://localhost:443/auth/facebook/callback"
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));
app.get('/auth/facebook', _passport["default"].authenticate('facebook'));
app.get('/auth/facebook/callback', _passport["default"].authenticate('facebook', {
  failureRedirect: '/'
}), function (req, res) {
  res.redirect('/');
});
app.get('/profile', isAuthenticated, function (req, res) {
  res.json({
    user: req.user
  });
});
var _default = app;
exports["default"] = _default;