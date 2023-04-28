import app from "../services/server";



//Indicamos que vamos a usar passport en todas nuestras rutas
app.use(passport.initialize());

//Permitimos que passport pueda manipular las sessiones de nuestra app
app.use(passport.session());

// Cuando un usuario se autentique correctamente, passport va a devolver en la session la info del usuario
passport.use('login', loginFunc);

//signUpFunc va a ser una funcion que vamos a crear y va a tener la logica de registro de nuevos usuarios
passport.use('signup', signUpFunc);


// AUTENTICACION CON GOOGLE:

app.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/oauth2/redirect/accounts.google.com', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

passport.use(
    new googleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "/oauth2/redirect/accounts.google.com",   
        scope: ["profile"], 
        state: true,
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      },
    ),
  );


app.get("/", ensureLoggedIn(), (req, res) => {
  res.send(`
            <h1>Bienvenido ${req.user.displayName}!</h1>
            `);
  logger.info(req.sessionID);
  logger.info(req.session);
  logger.info(req.user);
});

export default app