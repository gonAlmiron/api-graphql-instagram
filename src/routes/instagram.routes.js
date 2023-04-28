import {Router} from 'express';
import { getDataREST, getDataUsuario, getFollowers } from '../controllers/instagram.controllers';

const router = Router();

router.get('/', getFollowers)

router.get('/rest', getDataREST)

router.get('/datos', getDataUsuario)

export default router