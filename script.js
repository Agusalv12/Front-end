// Validación de formulario
document.addEventListener("DOMContentLoaded", () => {
  const contactoForm = document.querySelector("#contacto form");
  if (contactoForm) {
    contactoForm.addEventListener("submit", (e) => {
      const email = contactoForm.email.value;
      const regex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
      if (!regex.test(email)) {
        e.preventDefault();
        alert("Por favor, introduce un correo válido.");
      }
    });
  }
});

// Fetch productos desde API
fetch("https://fakestoreapi.com/products?limit=6")
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector(".productos-container");
    container.innerHTML = "";
    data.forEach(product => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" style="width:100px;height:100px;object-fit:contain;">
        <h4>${product.title}</h4>
        <p>$${product.price}</p>
        <button data-id="${product.id}">Agregar al carrito</button>
      `;
      container.appendChild(card);
    });
  });

// Carrito con localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  contador.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

document.body.addEventListener("click", (e) => {
  if (e.target.matches(".card button")) {
    const id = e.target.dataset.id;
    const title = e.target.parentElement.querySelector("h4").textContent;
    const price = parseFloat(e.target.parentElement.querySelector("p").textContent.replace("$",""));
    const img = e.target.parentElement.querySelector("img").src;
    const existing = carrito.find(item => item.id === id);
    if (existing) {
      existing.cantidad++;
    } else {
      carrito.push({ id, title, price, cantidad:1, img });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    mostrarCarrito();
  }
});

function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach(item => {
    total += item.price * item.cantidad;
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.img}" alt="${item.title}" style="width:30px;height:30px;">
      ${item.title} - $${item.price} x 
      <input type="number" value="${item.cantidad}" min="1" data-id="${item.id}">
      <button data-id="${item.id}">Eliminar</button>
    `;
    lista.appendChild(li);
  });
  document.getElementById("total-carrito").textContent = `Total: $${total.toFixed(2)}`;
}

document.body.addEventListener("input", (e) => {
  if (e.target.matches("#lista-carrito input")) {
    const id = e.target.dataset.id;
    const cantidad = parseInt(e.target.value);
    const producto = carrito.find(item => item.id === id);
    if (producto) {
      producto.cantidad = cantidad;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarContador();
      mostrarCarrito();
    }
  }
});

document.body.addEventListener("click", (e) => {
  if (e.target.matches("#lista-carrito button")) {
    const id = e.target.dataset.id;
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    mostrarCarrito();
  }
});

actualizarContador();
mostrarCarrito();