import { config } from "dotenv"

config()

export const PORT = process.env.PORT || 3000
export const DB_HOST = process.env.DB_HOST || 'ep-snowy-voice-78086154.us-east-2.aws.neon.fl0.io'
export const DB_PORT = process.env.DB_PORT || 5432
export const DB_USER = process.env.DB_USER || 'fl0user'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'maIiGeY8fz4c'
export const DB_DATABASE = process.env.DB_DATABASE || 'gametemp'