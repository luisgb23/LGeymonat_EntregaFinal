import express from "express";
import { Server as HttpServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import path from 'path';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/ProductManager.js';
import connectDB from './config/database.js';
import setupHandlebars from './config/handlebars.js';

const app = express();
const httpServer = new HttpServer(app);
const io = new SocketIO(httpServer);

const __dirname = path.resolve();

const productManager = new ProductManager();

// Connectar MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/src/public')));

app.engine('handlebars', setupHandlebars());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/src/views'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter(productManager));

//console.log('Vistas buscadas en:', path.join(__dirname, '/src/views'));

io.on('connection', async socket => {
  console.log('Cliente conectado por socket');

  const { payload: productos } = await productManager.getProducts();
  socket.emit('updateProducts', productos);

  socket.on('addProduct', async product => {
    await productManager.addProduct(product);
    const { payload: productosActualizados } = await productManager.getProducts();
    io.emit('updateProducts', productosActualizados);
  });

  socket.on('deleteProduct', async id => {
    await productManager.deleteProduct(id);
    const { payload: productosActualizados } = await productManager.getProducts();
    io.emit('updateProducts', productosActualizados);
  });
});

httpServer.listen(8080, () => {
  console.log('Servidor escuchando en puerto 8080');
});

