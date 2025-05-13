import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import mongoose from 'mongoose';

const router = Router();
const manager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, query, category, status } = req.query;
    
    // Filtro
    let filter = {};
    if (query) {
      try {
        Object.assign(filter, JSON.parse(query));
      } catch (e) {
        return res.status(400).json({ status: 'error', message: 'query debe ser un JSON válido' });
      }
    }
    if (category) filter.category = category;
    if (status !== undefined) {
      if (status === 'true' || status === true) filter.status = true;
      else if (status === 'false' || status === false) filter.status = false;
    }

    const options = {
      limit: limit ? parseInt(limit) : 10,
      page: page ? parseInt(page) : 1,
      sort: sort || null,
      query: Object.keys(filter).length ? filter : null
    };

    const result = await manager.getProducts(options);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID format'
      });
    }

    const product = await manager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await manager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID format'
      });
    }

    const updated = await manager.updateProduct(req.params.pid, req.body);
    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID format'
      });
    }

    await manager.deleteProduct(req.params.pid);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
