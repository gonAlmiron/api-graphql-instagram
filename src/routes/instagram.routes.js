import {Router} from 'express';
import { getDataREST, getDataUsuario, getFollowers, getGraph } from '../controllers/instagram.controllers';

const router = Router();

router.get('/', getFollowers)

router.get('/rest', getDataREST)

router.get('/datos', getDataUsuario)

router.get('/graph', getGraph)

export default router