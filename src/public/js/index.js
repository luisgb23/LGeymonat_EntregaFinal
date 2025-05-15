const socket = io();

const addForm = document.getElementById('addForm');
if (addForm) {
  addForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const product = {
      title: data.get('title'),
      description: data.get('description'),
      code: data.get('code'),
      price: parseFloat(data.get('price')),
      stock: parseInt(data.get('stock')),
      status: true,
      category: data.get('category'),
      thumbnails: data.get('thumbnails')?.split(',') || []
    };
    socket.emit('addProduct', product);
    e.target.reset();
  });
}

socket.on('updateProducts', products => {
  const tableBody = document.getElementById('product-table-body');
  tableBody.innerHTML = '';

  products.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td>$${p.price}</td>
      <td>${p.stock}</td>
      <td>${p.category}</td>
      <td><button data-id="${p.id}" class="btn btn-danger">Eliminar</button></td>
    `;
    tableBody.appendChild(row);
  });
/*
  document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      socket.emit('deleteProduct', id);
    });
  });
  */
  document.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-id'));

      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Querés eliminar el producto con ID ${id}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          socket.emit('deleteProduct', id);
          Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
        }
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const CART_ID = '681cf9f2f5063cb016b98c98'; 

  const buttons = document.querySelectorAll('.add-to-cart-btn');
  console.log('Buscando botones para agregar al carrito...', buttons);

  buttons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const productId = btn.getAttribute('data-productid');
      console.log('Click en agregar al carrito', productId);
      try {
        const res = await fetch(`/api/carts/${CART_ID}/product/${productId}`, {
          method: 'POST'
        });
        if (res.ok) {
          Swal.fire('¡Éxito!', 'Producto agregado al carrito', 'success');
        } else {
          const data = await res.json();
          Swal.fire('Error', data.message, 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Error al agregar al carrito', 'error');
      }
    });
  });
});



