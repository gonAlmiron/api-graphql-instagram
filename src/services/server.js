import express, {Router} from 'express';
import MainRouter from '../routes'
import MongoStore from 'connect-mongo';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import config from '../config';
import passport from 'passport';
import InstagramStrategy from 'passport-instagram';
import FacebookStrategy from 'passport-facebook';

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


//Indicamos que vamos a usar passport en todas nuestras rutas
app.use(passport.initialize());

//Permitimos que passport pueda manipular las sessiones de nuestra app
app.use(passport.session());


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const accessToken = 'EAADSzpbdiTABADaSWymRjBlrQg4DosFxa7hKYlBFZAgC5fyI5H9GYfhBz8i9aj1FVT4p5nF57VCoc8wtVlov5OhB2gLn6xkaZC2xlTLS4azMW8JZCZAtLVbFtv5NtxT28ILNaOIibRrAkZAKjtZByiV9grdgZAIoj9BMIQppa02H1S8gpy3qEZCpQvsa2r527kbA4RgQ0ckqrwZDZD'
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

// ---------------------   PASSPORT FACEBOOK --------------------------------------------------------------------



passport.use(new FacebookStrategy({
  clientID: '231784736196912',
  clientSecret: '1e5e97c03d88f4826283eb2fd7e501cb',
  callbackURL: "http://localhost:8080/auth/facebook/callback"
},

function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

app.get('/auth/facebook',
  passport.authenticate('facebook'));
 
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

  app.get('/profile', isAuthenticated, function(req, res) {
    res.render('profile', { user: req.user });
  });


  export default app;