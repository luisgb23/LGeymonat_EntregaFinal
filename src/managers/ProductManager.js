import Product from '../models/Product.js';

export default class ProductManager {
  async getProducts(options = {}) {
    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = options;

    // Build filter object
    const filter = {};
    if (query) {
      if (query.category) {
        filter.category = query.category;
      }
      if (query.status !== undefined) {
        filter.status = query.status;
      }
    }

    // Build sort object
    const sortOptions = {};
    if (sort) {
      sortOptions.price = sort === 'asc' ? 1 : -1;
    }

    try {
      // Get total count for pagination
      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      // Get paginated products
      const products = await Product.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit);

      // Build response object
      const response = {
        status: 'success',
        payload: products,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `?page=${page - 1}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${JSON.stringify(query)}` : ''}` : null,
        nextLink: page < totalPages ? `?page=${page + 1}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${JSON.stringify(query)}` : ''}` : null
      };

      return response;
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      throw new Error(`Error getting product: ${error.message}`);
    }
  }

  async addProduct(product) {
    try {
      // Handle thumbnails
      if (product.thumbnails && product.thumbnails.length > 0) {
        product.thumbnail = product.thumbnails[0];
      }
      
      const newProduct = new Product(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error(`Error adding product: ${error.message}`);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      // Handle thumbnails in updates
      if (updatedFields.thumbnails && updatedFields.thumbnails.length > 0) {
        updatedFields.thumbnail = updatedFields.thumbnails[0];
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true, runValidators: true }
      );
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}
