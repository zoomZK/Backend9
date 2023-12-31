import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

const cartRouter = Router()

cartRouter.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const cart = await cartModel.findById(id)
        if (cart)
            res.status(200).send({ respuesta: 'OK', mensaje: cart })
        else
            res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar carrito', mensaje: error })
    }
})

cartRouter.post('/', async (req, res) => {

    try {
        const cart = await cartModel.create({})
        res.status(200).send({ respuesta: 'OK', mensaje: cart })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear Carrito', mensaje: error })
    }
})

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid)

            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod == pid)
                if (indice != -1) {
                    cart.products[indice].quantity = quantity 
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity }) 
                }
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart) 
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
            } else {
                res.status(404).send({ respuesta: 'Error en agregar producto al Carrito', mensaje: 'Product Not Found' })
            }
        } else {
            res.status(404).send({ respuesta: 'Error en agregar producto al Carrito', mensaje: 'Cart Not Found' })
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({ respuesta: 'Error en agregar producto al Carrito', mensaje: error })
    }
})

export default cartRouter