import {Router} from 'express';
import { captureCode, getDataIg, getToken } from '../controllers/auth.controllers';

const router = Router();

router.get('/code', captureCode)

router.get('/token', getToken)

router.post('/token', getToken);

router.get('/data', getDataIg);

export default router