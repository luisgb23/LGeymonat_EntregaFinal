import fs from 'fs/promises';

export default class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async getCarts() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async createCart() {
    const carts = await this.getCarts();
    const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
    const newCart = { id, products: [] };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === cid);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;
    const existing = cart.products.find(p => p.product === pid);
    if (existing) {
      existing.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}
