import { Router } from 'express'
import { getUsers,login,createUser } from '../controllers/users.controller.js'

const router = Router()

router.get('/users', getUsers)
router.post('/login', login)
router.post('/user', createUser)

export default router