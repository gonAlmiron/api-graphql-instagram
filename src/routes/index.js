import {Router} from 'express';
import instagramRouter from './instagram.routes'

const router = Router();

router.use('/ig', instagramRouter)

router.get('/', (req, res) => {
    res.send('HOLA')
})

export default router



