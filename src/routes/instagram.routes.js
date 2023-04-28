import {Router} from 'express';
import { getDataREST, getFollowers } from '../controllers/instagram.controllers';

const router = Router();

router.get('/', getFollowers)

router.get('/rest', getDataREST)

export default router