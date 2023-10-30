import { client } from '../db.js'

export const getUsers = async (req,res) => {
    try {
        await client.connect()
        const {rows} = await client.query('select * from user_app')
        res.json(rows)
        await client.end()
    } catch (error) {
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}