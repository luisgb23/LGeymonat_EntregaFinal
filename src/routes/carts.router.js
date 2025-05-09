import { Router } from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = Router();

// Crear un nuevo carrito vacío
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Obtener un carrito por ID con populate
router.get('/:cid', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Agregar producto al carrito (o aumentar cantidad)
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    const prodInCart = cart.products.find(p => p.product.equals(pid));
    if (prodInCart) {
      prodInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE api/carts/:cid/products/:pid - Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    cart.products = cart.products.filter(p => !p.product.equals(pid));
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT api/carts/:cid - Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // [{ product, quantity }]
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }
    // Validar que todos los productos existan
    for (const item of products) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ status: 'error', message: `ID de producto inválido: ${item.product}` });
      }
      const prod = await Product.findById(item.product);
      if (!prod) {
        return res.status(404).json({ status: 'error', message: `Producto no encontrado: ${item.product}` });
      }
    }
    const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT api/carts/:cid/products/:pid - Actualizar SOLO la cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'Cantidad inválida' });
    }
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    const prodInCart = cart.products.find(p => p.product.equals(pid));
    if (!prodInCart) return res.status(404).json({ status: 'error', message: 'Producto no está en el carrito' });
    prodInCart.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE api/carts/:cid - Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    cart.products = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
