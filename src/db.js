import pkg from 'pg'
import { DB_HOST,DB_PORT,DB_USER,DB_PASSWORD,DB_DATABASE } from './config.js'

const { Pool } = pkg

export const pool = new Pool({
    host: DB_HOST,
    user: DB_USER,
    port: DB_PORT,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    ssl: true
})