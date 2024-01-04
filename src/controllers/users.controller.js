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
        console.log(req.body)

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
                        phone: result.rows[0].phone,
                        balance: result.rows[0].balance
                    }
                })
            }
            else {
                return res.send({
                    success: false,
                    idError:'1.2',
                    message: 'Password no corresponde al registrado',
                    user: null
                })
            }
            
        }
        else {
            return res.send({
                success: false,
                idError:'1.1',
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
        if (name === undefined || name.length === 0) {
            return res.send({
                success: false,
                idError:'2.1',
                message: 'Debe incluir un nombre de usuario',
                user: null
            })
        }
        if (email === undefined || name.length === 0) {
            return res.send({
                success: false,
                idError:'2.2',
                message: 'Debe incluir un email de usuario',
                user: null
            })
        }
        else {
            const {rowCount} = await pool.query('select * from user_app where email = $1 and record_status <> 3',[email])

            if (rowCount > 0) {
                return res.send({
                    success: false,
                    idError:'2.3',
                    message: 'Ya existe el usuario que quiere registrar',
                    user: null
                })
            }
        }
        if (password === undefined || name.length === 0) {
            return res.send({
                success: false,
                idError:'2.4',
                message: 'Debe incluir un password de usuario',
                user: null
            })
        }
        else if(password.length < 8) {
            return res.send({
                success: false,
                idError:'2.5',
                message: 'Debe incluir un password de usuario mayor o igual a 8 caracteres',
                user: null
            })
        }

        const hashPassword = await bcrypt.hash(password,10)

        const {rows} = await pool.query('select value_flt from game_parameter where type = \'INITIAL_BALANCE\' and flag_1 = 1 and record_status <> 3')
        console.log(rows)
        var initBalance = 0.0
        if (rows.length > 0) {
            initBalance = rows[0].value_flt
        }
        console.log(initBalance)

        const {rowCount} = await pool.query('Insert into user_app(name,phone,email,password,imei,model,creation_date,last_cnx_date,balance) ' +
                                        'values ($1,$2,$3,$4,$5,$6,LOCALTIMESTAMP- interval \'5 hours\',LOCALTIMESTAMP- interval \'5 hours\',$7);',
                                        [name,phone,email,hashPassword,imei,model,initBalance])
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
                    phone: rows[0].phone,
                    balance: rows[0].balance
                }
                
            })
        }
        else {
            return res.send({
                success: false,
                idError:'2.6',
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

export const getProductByRound = async (req,res) => {
    try {
        const {idRound} = req.body
        const {rows} = await pool.query('select * from product where level_id = $1 order by id',[idRound])
        if (rows.length > 0) {
            var products = []
            for(var i = 0; i< rows.length; i++){
                var product = new Object()
                product.id = rows[i].id
                product.name = rows[i].name
                product.purchasePrice= rows[i].purchase_price
                product.salePrice = rows[i].sale_price
                product.round = idRound
                product.img = rows[i].foto
                products.push(product)
            }
            res.send({
                success: true,
                message: '',
                products:products 
            })
        }
        else {
            res.send({
                success: false,
                idError:'3.1',
                message: 'No existen productos para esa ronda',
                products: null
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo salió mal'
        })
    }
}

export const getBuyUser = async (req,res) => {
    try {
        const {idUser,idProduct,idLevel,costBuy} = req.body
        const {rowCount} = await pool.query('update user_app set balance = balance - $1, level = $2 where id = $3',[costBuy,idLevel,idUser])
        if(rowCount) {
            const {rowCount} = await pool.query('insert into his_user_app(id_user,id_product,type_transaction,amount,creation_date) ' +
                                            'values ($1,$2,\'BUY\',$3,LOCALTIMESTAMP- interval \'5 hours\');',
                                            [idUser,idProduct,costBuy])
            if (rowCount > 0) {
                const {rows} = await pool.query('select * from user_app where id = $1 and record_status <> 3',[idUser])
                res.send({
                    success: true,
                    message: '',
                    user:
                    {
                        id: rows[0].id,
                        name: rows[0].name,
                        email: rows[0].email,
                        phone: rows[0].phone,
                        balance: rows[0].balance
                    }
                    
                })
            }
            else {
                return res.send({
                    success: false,
                    idError:'4.2',
                    message: 'No se pudo registrar el historial de compra del usuario',
                    user: null
                })
            }
        }
        else {
            return res.send({
                success: false,
                idError:'4.1',
                message: 'No se pudo actualizar el saldo del usuario',
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