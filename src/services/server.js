import express, {Router} from 'express';
import MainRouter from '../routes'
import MongoStore from 'connect-mongo';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import config from '../config';
import passport from 'passport';
import InstagramStrategy from 'passport-instagram';
import FacebookStrategy from 'passport-facebook';
import { UserModel } from '../models/user';
import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv'
import cors from 'cors'


dotenv.config();

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

// Cert. SSL
const httpsServerOptions = {
	key: fs.readFileSync(process.env.KEY_PATH),
	cert: fs.readFileSync(process.env.CERT_PATH)
}
const serverHttps = https.createServer(httpsServerOptions, app)
serverHttps.listen(process.env.HTTPS_PORT, function(){
	console.log(`Escuchando en el puerto ${process.env.HTTPS_PORT}`)
});


// CONFIGURACION SESSIONS DEL USUARIO
const ttlSeconds = 6000;
const StoreOptions = {
  store: MongoStore.create({
    mongoUrl: config.MONGO_ATLAS_URI,
    crypto: {
      secret: 'squirrel',
    },
  }),
  secret: 'shhhhhh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: ttlSeconds,
  },
};

app.use(session(StoreOptions));
const mySecret = 'mySecret';
app.use(cookieParser(mySecret));
app.use('/api', MainRouter)

// ---------- Inicialización Passport ------------------- 


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());


// ---------------------   PASSPORT INSTAGRAM ------------------------ API GRAPH VISUALIZACION BASICA DE INSTAGRAM -------------------------------------------- 


const accessToken = 'EAADSzpbdiTABALFhaoAZC12W8sn2085XubkTzRVC5qxHxwcqAuPcoK3Oa17ZAYHajVIdBThZALEjkgYKQEPSQlpQ0jd0ELz28r4S9DrAQdsZCfK8cXpiPZClGtRLjxIPHYSh1uC1AgsQ1ZB3hfGf8dgCOV6zoR7iPZCSNMtyREHllQ622lpVV2n8mlGYI6TbaaPBws765VZAcwZDZD'
passport.use(new InstagramStrategy({
    clientID: '180895391557997',
    clientSecret: 'b45df1e98fe84fceb1924f7c451a584e',
    callbackURL: 'https://localhost:443/auth/instagram/callback'
  },
  
  function(accessToken, refreshToken, profile, done) {

    const data = {
      token: accessToken,
      profileIg: profile
    }

    UserModel.create(data)
    return done(null, profile);
  }
));

// Iniciar sesión con Instagram
app.get('/auth/instagram', passport.authenticate('instagram'));

app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


  app.get('/profile', isAuthenticated, function(req, res) {
    res.json ({ user: req.user });
  });


  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }

// ---------------------   PASSPORT FACEBOOK --------------------------------------------------------------------


passport.use(new FacebookStrategy({
  clientID: '231784736196912',
  clientSecret: '1e5e97c03d88f4826283eb2fd7e501cb',
  callbackURL: "https://localhost:443/auth/facebook/callback"
},

function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
))

app.get('/auth/facebook',
  passport.authenticate('facebook'));
 
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', 
    { 
    failureRedirect: '/',
    }),
  (req, res) => {
    res.redirect('/');
  });

  app.get('/profile', isAuthenticated, function(req, res) {
    res.json({ user: req.user });
  });


  export default app;