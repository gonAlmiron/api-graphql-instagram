import express, {Router} from 'express';
import MainRouter from '../routes'
import MongoStore from 'connect-mongo';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import config from '../config';
import passport from 'passport';
import InstagramStrategy from 'passport-instagram';

const app = express()

app.use(express.urlencoded({extended:true}));
app.use(express.json());

// CONFIGURACION SESSIONS DEL USUARIO
const ttlSeconds = 1800;
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
    maxAge: ttlSeconds * 1000,
  },
};


app.use(session(StoreOptions));
const mySecret = 'mySecret';
app.use(cookieParser(mySecret));
app.use('/api', MainRouter)



passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
const accessToken = 'EAAQgnwlIu5kBAGZAYXR9xh0uoZCArg02A6FumbS2IDcLPtxVwvw2kWSj5Uy8VogbeicEd8KPbbdeiMkYJC4TZC5hvh1e5dd0eNZCwwLS8IydZCLQ8LySYOLpHkCPZCiucTRm7MeKq30YcTOZCqq3izBMrNhkZBKZCMapW8kH8m6j6nFvIngpPCyWNeIpfuHPgyu3TZCdPkobfPONcUaYUmSw1ZAcOcdUgbVTXmOWDQ53HV7sazFuC4yAurP'
passport.use(new InstagramStrategy({
    clientID: '242048968368293',
    clientSecret: 'e8e8658c62a2dd2065f2ffa3d00465bc',
    callbackURL: 'http://localhost:8080/auth/instagram/callback'
  },
  
  function(accessToken, refreshToken, profile, done) {
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

// Protege las rutas que requieren autenticación

app.get('/profile', isAuthenticated, function(req, res) {
    res.render('profile', { user: req.user });
  });

// Middleware para verificar si el usuario está autenticado
  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }





export default app