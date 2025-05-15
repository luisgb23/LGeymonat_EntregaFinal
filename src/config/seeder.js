import mongoose from 'mongoose';
import Product from '../models/Product.js';
import connectDB from './database.js';

const products = [
  {
    title: "Mouse Gamer RGB",
    description: "Mouse ergonómico con luces LED RGB, 6 botones programables",
    price: 1500,
    thumbnail: "https://www.pccompu.com.uy/imgs/productos/productos34_44447.jpg",
    code: "MG100",
    stock: 30,
    status: true,
    category: "periféricos"
  },
  {
    title: "Teclado Mecánico RGB",
    description: "Teclado mecánico con switches rojos y retroiluminación RGB personalizable",
    price: 3500,
    thumbnail: "https://img.kwcdn.com/product/1e78ea4c92/77d5379d-6ca3-4c41-942a-20319ec5c8e3_800x800.jpeg",
    code: "TK200",
    stock: 15,
    status: true,
    category: "periféricos"
  },
  {
    title: "Monitor AOC 24\"",
    description: "Monitor LED 24 pulgadas Full HD, 144Hz, 1ms",
    price: 6500,
    thumbnail: "https://www.pccompu.com.uy/imgs/productos/productos34_56163.jpg",
    code: "MN300",
    stock: 8,
    status: true,
    category: "monitores"
  },
  {
    title: "Auriculares Gaming",
    description: "Auriculares gaming con micrófono retráctil y cancelación de ruido",
    price: 2800,
    thumbnail: "https://www.pccompu.com.uy/imgs/productos/productos34_44448.jpg",
    code: "AH400",
    stock: 20,
    status: true,
    category: "audio"
  },
  {
    title: "Mousepad Gaming",
    description: "Mousepad gaming XXL con superficie de tela y base antideslizante",
    price: 800,
    thumbnail: "https://www.pccompu.com.uy/imgs/productos/productos34_44449.jpg",
    code: "MP500",
    stock: 50,
    status: true,
    category: "accesorios"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log('Base de datos limpiada');

    await Product.insertMany(products);
    console.log('Productos agregados exitosamente');

    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase(); 