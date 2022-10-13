const express = require('express');
const { Router } = express;
const router = Router();
const products = require('../class/Products');
const Cart = require('../class/Cart');
const cart = new Cart('carritos.json');

/**
 * RUTAS PRODUCTOS
 */
router.get('/api/productos/', (req, res) => {
    products.getAll().then(resp => res.json(resp));
});

router.get('/api/productos/:id', (req, res) => {
    const id = req.params.id;
    products.getById(id).then(resp => res.json(resp));
});

router.post('/api/productos', (req, res) => {
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    const product = {
        nombre: nombre,
        descripcion: descripcion,
        codigo: codigo,
        foto: foto,
        precio: precio,
        stock: stock
    }
    products.addProducts(product).then(res.json({'Message': 'Product added successfully.'}));
});

router.put('/api/productos/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    const product = {
        nombre: nombre,
        descripcion: descripcion,
        codigo: codigo,
        foto: foto,
        precio: precio,
        stock: stock
    }
    products.update(id, product).then(resp => res.json(resp));
});

router.delete('/api/productos/:id', (req, res) => {
    const id = req.params.id;
    products.deleteById(id).then(resp => res.json(resp));
});

/**
 * RUTAS CARRITO
 */
router.post('/api/carrito', (req, res) => {
    cart.createCart().then(resp => res.json(resp));
});

router.delete('/api/carrito/:id', (req, res) => {
    const id = req.params.id;
    cart.deleteCart(id).then(resp => res.json(resp));
});

router.get('/api/carrito/:id/productos', (req, res) => {
    const id = req.params.id;
    cart.getCartProducts(id).then(resp => res.json(resp));
});

router.post('/api/carrito/:id/productos', (req, res) => {
    const id = req.params.id;
    cart.addProductToCart(id, products.getAll()).then(resp => res.json(resp));
});

router.delete('/api/carrito/:id/productos/:id_prod', (req, res) => {
    const idCart = req.params.id;
    const idProd = req.params.id_prod;
    cart.deleteProductInToCart(idCart,idProd).then(resp => res.json(resp));
});

module.exports = router;