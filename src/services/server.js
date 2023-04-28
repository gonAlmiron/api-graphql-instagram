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

passport.use(new InstagramStrategy({
    clientID: '560448932859727',
    clientSecret: '1901037cc82055d218510e693c71660b',
    callbackURL: 'http://localhost:3000/auth/instagram/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// Iniciar sesión con Instagram
app.get('/auth/instagram', passport.authenticate('instagram'));

app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
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