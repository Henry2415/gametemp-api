import { Router } from 'express'
import { getUsers,login,createUser,getProductByRound } from '../controllers/users.controller.js'

const router = Router()

router.get('/users', getUsers)
router.post('/login', login)
router.post('/user', createUser)
router.post('/product', getProductByRound)

export default router