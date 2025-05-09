import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

const viewsRouter = (productManager) => {
  router.get('/', async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query, category, status } = req.query;
      
      // Get unique categories
      const categories = await Product.distinct('category');
      
      // Construir el filtro combinando query JSON y params amigables
      let filter = {};
      if (query) {
        try {
          Object.assign(filter, JSON.parse(query));
        } catch (e) {
          return res.render('index', { products: [], categories: [], error: 'query debe ser un JSON válido' });
        }
      }
      if (category) filter.category = category;
      if (status !== undefined) {
        if (status === 'true' || status === true) filter.status = true;
        else if (status === 'false' || status === false) filter.status = false;
      }

      // Get products with pagination and filters
      const result = await productManager.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query: Object.keys(filter).length ? filter : null
      });

      // Add pagination data for the view
      const pagination = {
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
        pages: Array.from({ length: result.totalPages }, (_, i) => ({
          number: i + 1,
          active: i + 1 === result.page,
          link: `?page=${i + 1}&limit=${limit}${sort ? `&sort=${sort}` : ''}${category ? `&category=${category}` : ''}${status ? `&status=${status}` : ''}`
        }))
      };

      res.render('index', { 
        products: result.payload,
        categories,
        pagination
      });
    } catch (error) {
      console.error('Error:', error);
      res.render('index', { 
        products: [],
        categories: [],
        error: 'Error al cargar los productos'
      });
    }
  });

  router.get('/realtimeproducts', async (req, res) => {
    const { payload: products } = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  });

  // Nueva ruta para visualizar un carrito específico
  router.get('/carts/:cid', async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
      if (!cart) {
        return res.status(404).render('cart', { cart: { products: [] }, error: 'Carrito no encontrado' });
      }
      res.render('cart', { cart });
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      res.status(500).render('cart', { cart: { products: [] }, error: 'Error al cargar el carrito' });
    }
  });

  return router;
};

export default viewsRouter;

