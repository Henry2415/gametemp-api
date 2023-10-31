import { Router } from 'express'
import { getUsers,getUser,createUser } from '../controllers/users.controller.js'

const router = Router()

router.get('/users', getUsers)
router.get('/user', getUser)
router.post('/user', createUser)

export default router