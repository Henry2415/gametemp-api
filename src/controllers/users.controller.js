import { pool } from "../db.js"
import bcrypt from 'bcrypt'

export const getUsers = async (req,res) => {
    try {
        const {rows} = await pool.query('select * from user_app')
        res.json(rows)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}

export const login = async (req, res) => {
    try {
        const {email,password} = req.body
        console.log(res.body)
        const result = await pool.query('select * from user_app where email = $1 and record_status <> 3',[email])
        if (result.rowCount > 0) {
            const passwordBD = result.rows[0].password
            const compareResult = await bcrypt.compare(password,passwordBD)
            if (compareResult) {
                //res.json(result.rows[0])
                res.send({
                    success: true,
                    message: '',
                    user:
                    {
                        id: result.rows[0].id,
                        name: result.rows[0].name,
                        email: result.rows[0].email,
                        phone: result.rows[0].phone
                    }
                })
            }
            else {
                return res.send({
                    success: false,
                    errorId:'1.2',
                    message: 'Password no corresponde al registrado',
                    user: null
                })
            }
            
        }
        else {
            return res.send({
                success: false,
                errorId:'1.1',
                message: 'Usuario no existe',
                user: null
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}

export const createUser = async (req,res) => {
    try {
        const {name,email,password,phone,imei,model} = req.body

        //VALIDACIONES
        if (name === undefined) {
            return res.send({
                success: false,
                errorId:'2.1',
                message: 'Debe incluir un nombre de usuario',
                user: null
            })
        }
        if (email === undefined) {
            return res.send({
                success: false,
                errorId:'2.2',
                message: 'Debe incluir un email de usuario',
                user: null
            })
        }
        else {
            const {rowCount} = await pool.query('select * from user_app where email = $1 and record_status <> 3',[email])

            if (rowCount > 0) {
                return res.send({
                    success: false,
                    errorId:'2.3',
                    message: 'Ya existe el usuario que quiere registrar',
                    user: null
                })
            }
        }
        if (password === undefined) {
            return res.send({
                success: false,
                errorId:'2.4',
                message: 'Debe incluir un password de usuario',
                user: null
            })
        }
        else if(password.length < 8) {
            return res.send({
                success: false,
                errorId:'2.5',
                message: 'Debe incluir un password de usuario mayor o igual a 8 caracteres',
                user: null
            })
        }

        const hashPassword = await bcrypt.hash(password,10)

        const {rowCount} = await pool.query('Insert into user_app(name,phone,email,password,imei,model,creation_date,last_cnx_date) ' +
                                        'values ($1,$2,$3,$4,$5,$6,LOCALTIMESTAMP- interval \'5 hours\',LOCALTIMESTAMP- interval \'5 hours\');',
                                        [name,phone,email,hashPassword,imei,model])
        if (rowCount > 0) {
            const {rows} = await pool.query('select * from user_app where email = $1 and record_status <> 3',[email])
            res.send({
                success: true,
                message: '',
                user:
                {
                    id: rows[0].id,
                    name: rows[0].name,
                    email: rows[0].email,
                    phone: rows[0].phone
                }
                
            })
        }
        else {
            return res.send({
                success: false,
                errorId:'2.6',
                message: 'No se pudo registrar el usuario',
                user: null
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}