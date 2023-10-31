import { pool } from "../db.js"

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

export const getUser = async (req, res) => {
    try {
        const {email,password} = req.body
        const result = await pool.query('select * from user_app where email = $1 and password = $2',[email,password])
        if (result.rowCount > 0) {
            res.json(result.rows[0])
        }
        else {
            res.json({
                message: 'Usuario y/o contraseña erronea'
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
        const {name,email,password,phone,imei,modelo} = req.body

        //VALIDACIONES
        if (name === undefined) {
            return res.json({
                message: 'Debe incluir un nombre de usuario'
            })
        }
        if (email === undefined) {
            return res.json({
                message: 'Debe incluir un email de usuario'
            })
        }
        else {
            const {rowCount} = await pool.query('select * from user_app where email = $1 and estado_registro <> 3',[email])

            if (rowCount > 0) {
                return res.json({
                    message: 'Ya existe el usuario que quiere registrar'
                })
            }
        }
        if (password === undefined) {
            return res.json({
                message: 'Debe incluir un password de usuario'
            })
        }
        else if(password.length < 8) {
            return res.json({
                message: 'Debe incluir un password de usuario mayor o igual a 8 caracteres'
            })
        }

        const result = await pool.query('Insert into user_app(name,phone,email,password,imei,modelo,fecha_creacion,fecha_ult_conex) ' +
                                        'values ($1,$2,$3,$4,$5,$6,current_timestamp,current_timestamp);',
                                        [name,phone,email,password,imei,modelo])
        res.json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}