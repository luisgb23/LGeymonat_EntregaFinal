const socket = io();
socket.on('updateProducts', products => {
    const container = document.getElementById("product-container");
    products.forEach(producto => {
      console.log("first")
      const card = document.createElement("div");
      card.className = "col-md-4";
    
      card.innerHTML = `
      <div class="card h-100">
        <img src="${producto.thumbnails[0]}" class="card-img-top" alt="${producto.title}">
        <div class="card-body">
          <h5 class="card-title">${producto.title}</h5>
          <p class="card-text">${producto.description}</p>
          <p><strong>Precio:</strong> $${producto.price}</p>
          <p><strong>Stock:</strong> ${producto.stock}</p>
          <p><strong>Categoría:</strong> ${producto.category}</p>
           <a href="#" class="btn btn-primary">Agregar al carrito</a>
        </div>
      </div>
    `;
    
      container.appendChild(card);
    });
    })