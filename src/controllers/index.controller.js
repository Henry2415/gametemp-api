import { client } from "../db.js"

export const ping = async (req,res) => {
    await client.connect()
    const result = await client.query('SELECT NOW()')
    res.json(result.rows[0])
    //console.log(result.rows[0])
    await client.end()
}