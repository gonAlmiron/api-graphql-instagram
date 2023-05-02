import {Router} from 'express';
import { userFB } from '../controllers/user.controllers';

const router = Router();

// Post que guarda datos del usuario de fb al iniciar sesion
router.post('/users', userFB)