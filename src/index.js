import app from './app.js'
import { PORT } from './config.js'

app.listen(PORT)
console.log("El servidor se esta ejecutando en el puerto", PORT)