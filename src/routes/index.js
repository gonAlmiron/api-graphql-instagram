import {Router} from 'express';
import instagramRouter from './instagram.routes'
import authRouter from './auth.routes'

const router = Router();

router.use('/ig', instagramRouter)

router.use('/auth', authRouter)

router.get('/', (req, res) => {
    res.send('HOLA')
})

export default router



