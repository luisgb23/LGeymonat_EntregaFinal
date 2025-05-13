// ID del carrito
const CART_ID = '681cf9f2f5063cb016b98c98'; 

// Eliminar un producto del carrito
async function removeProductFromCart(productId) {
    try {
        const response = await fetch(`/api/carts/${CART_ID}/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }
        
        const updatedCart = await response.json();
        updateCartView(updatedCart);
        Swal.fire('Éxito', 'Producto eliminado del carrito', 'success');
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

// Actualizar la cantidad de un producto
async function updateProductQuantity(productId, quantity) {
    quantity = Number(quantity);
    if (isNaN(quantity) || quantity < 1) {
        Swal.fire('Error', 'La cantidad debe ser al menos 1', 'error');
        const input = document.querySelector(`input[onchange*="'${productId}'"]`);
        if (input) input.value = 1;
        return;
    }
    try {
        const response = await fetch(`/api/carts/${CART_ID}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }
        
        const updatedCart = await response.json();
        updateCartView(updatedCart);
        Swal.fire('Éxito', 'Cantidad actualizada', 'success');
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

// Actualizar todos los productos del carrito
async function updateCartProducts(products) {
    try {
        const response = await fetch(`/api/carts/${CART_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ products })
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }
        
        const updatedCart = await response.json();
        updateCartView(updatedCart);
        Swal.fire('Éxito', 'Carrito actualizado', 'success');
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

// Vaciar carrito
async function clearCart() {
    try {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres vaciar todo el carrito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, vaciar carrito',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const response = await fetch(`/api/carts/${CART_ID}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }
            
            const updatedCart = await response.json();
            updateCartView(updatedCart);
            Swal.fire('Éxito', 'Carrito vaciado', 'success');
        }
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
}

// Actualizar la vista del carrito
function updateCartView(cart) {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;

    if (!cart.products || cart.products.length === 0) {
        cartContainer.innerHTML = '<p>El carrito está vacío</p>';
        return;
    }

    let html = `
        <div class="cart-items">
            <h3>Productos en el carrito</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;

    cart.products.forEach(item => {
        const product = item.product;
        const total = product.price * item.quantity;
        html += `
            <tr>
                <td>${product.title}</td>
                <td>
                    <input type="number" 
                           value="${item.quantity}" 
                           min="1" 
                           onchange="updateProductQuantity('${product._id}', this.value)"
                           class="form-control quantity-input">
                </td>
                <td>$${product.price}</td>
                <td>$${total}</td>
                <td>
                    <button onclick="removeProductFromCart('${product._id}')" 
                            class="btn btn-danger btn-sm">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
            <div class="cart-actions">
                <button onclick="clearCart()" class="btn btn-danger">
                    Vaciar Carrito
                </button>
            </div>
        </div>
    `;

    cartContainer.innerHTML = html;
}

// Cargar carrito al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`/api/carts/${CART_ID}`);
        if (!response.ok) {
            throw new Error('Error al cargar el carrito');
        }
        const cart = await response.json();
        updateCartView(cart);
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'No se pudo cargar el carrito', 'error');
    }
}); 