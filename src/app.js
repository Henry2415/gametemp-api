import express from 'express'
import indexRoutes from './routes/index.routes.js'
import usersRoutes from './routes/users.routes.js'

const app = express()

app.use(express.json())

app.use(indexRoutes)
app.use('/api',usersRoutes)

app.use((req,res,next) => {
    res.status(404).json({
        message: 'endpoint no encontrado'
    })
})

export default app