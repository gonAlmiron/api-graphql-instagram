import {Router} from 'express';
import { getDataREST, getDataUsuario, getFollowers, getGraph, getIDUsuario, curlGet, getCodeFacebook, getInfoFacebook } from '../controllers/instagram.controllers';

const router = Router();

router.get('/', getFollowers)

router.get('/rest', getDataREST)

router.get('/datos', getDataUsuario)

router.get('/graph', getGraph)

router.get('/getid', getIDUsuario)

router.get('/curl', curlGet)

router.post('/code', getCodeFacebook)

router.get('/info', getInfoFacebook)

export default router