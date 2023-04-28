import express from 'express';
import MainRouter from '../routes'
import MongoStore from 'connect-mongo';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import config from '../config';


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

export default app