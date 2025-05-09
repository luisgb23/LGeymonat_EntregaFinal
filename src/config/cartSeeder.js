import mongoose from 'mongoose';
import connectDB from './database.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const createExampleCart = async () => {
  try {
    await connectDB();
    // Buscar dos productos existentes
    const products = await Product.find().limit(2);
    if (products.length === 0) {
      console.log('No hay productos en la base de datos. Agrega productos primero.');
      process.exit(1);
    }
    // Crear carrito con productos y cantidades de ejemplo
    const cart = await Cart.create({
      products: [
        { product: products[0]._id, quantity: 2 },
        products[1] ? { product: products[1]._id, quantity: 1 } : null
      ].filter(Boolean)
    });
    console.log('Carrito de ejemplo creado con ID:', cart._id.toString());
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error al crear carrito de ejemplo:', error);
    process.exit(1);
  }
};

createExampleCart(); 