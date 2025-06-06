// === Animaciones de fade-in con IntersectionObserver ===
function initCardAnimations() {
  const cards = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    cards.forEach(card => observer.observe(card));
  } else {
    // Fallback: mostrar todo
    cards.forEach(card => card.classList.add('visible'));
  }
}

// === Botón de volver arriba ===
function initScrollTopBtn() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}



// === Sistema de Comentarios ===
function initCommentSystem() {
  document.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nameInput = form.querySelector('input');
      const textArea = form.querySelector('textarea');
      const name = nameInput.value.trim();
      const message = textArea.value.trim();
      if (!name || !message) return;

      const comment = document.createElement('div');
      comment.className = 'comment';
      comment.innerHTML = `<strong>${name}:</strong> ${message}`;

      const commentList = form.nextElementSibling;
      commentList.appendChild(comment);

      form.reset();
    });
  });
}

// === Toggle Modo Oscuro ===
function initDarkModeToggle() {
  const toggleBtn = document.getElementById('darkModeToggle');
  if (!toggleBtn) return;
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
}

// === Login / Registro Tabs (usando localStorage para usuarios) ===
function initLoginTab() {
  const tabHeaderLogin = document.getElementById('tab-login');
  const tabHeaderRegister = document.getElementById('tab-register');
  const loginForm  = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (!tabHeaderLogin || !tabHeaderRegister || !loginForm || !registerForm) return;

  tabHeaderLogin.addEventListener('click', () => {
    tabHeaderLogin.classList.add('active');
    tabHeaderRegister.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
  });

  tabHeaderRegister.addEventListener('click', e => {
    e.preventDefault();
    tabHeaderRegister.classList.add('active');
    tabHeaderLogin.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
  });

  // Registro en localStorage
  const registerMessage = document.getElementById('registerMessage');
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const newUser = document.getElementById('regUsername').value.trim();
    const newPass = document.getElementById('regPassword').value.trim();

    if (!newUser || !newPass) {
      registerMessage.textContent = "Completa todos los campos.";
      return;
    }

    if (localStorage.getItem(`user_${newUser}`)) {
      registerMessage.textContent = "Ese usuario ya existe.";
      return;
    }

    localStorage.setItem(`user_${newUser}`, newPass);
    registerMessage.style.color = "green";
    registerMessage.textContent = "Cuenta creada con éxito.";
    registerForm.reset();

    setTimeout(() => {
      tabHeaderLogin.click();
      registerMessage.style.color = "red";
      registerMessage.textContent = "";
    }, 1500);
  });

  // Login con validación
  const loginMessage = document.getElementById('loginMessage');
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
      loginMessage.textContent = "Completa todos los campos.";
      return;
    }

    if (username === "admin" && password === "1234") {
      loginMessage.style.color = "green";
      loginMessage.textContent = "¡Login exitoso (admin)!";
      return;
    }

    const storedPass = localStorage.getItem(`user_${username}`);
    if (storedPass && storedPass === password) {
      loginMessage.style.color = "green";
      loginMessage.textContent = "¡Login exitoso!";
    } else {
      loginMessage.style.color = "red";
      loginMessage.textContent = "Usuario o contraseña incorrectos.";
    }
  });

  // Botones sociales (placeholders)
  document.getElementById("googleLogin")?.addEventListener("click", () => {
    alert("Redirigiendo a login con Google…");
  });
  document.getElementById("facebookLogin")?.addEventListener("click", () => {
    alert("Redirigiendo a login con Facebook…");
  });
  document.getElementById("googleRegister")?.addEventListener("click", () => {
    alert("Redirigiendo a registro con Google…");
  });
  document.getElementById("facebookRegister")?.addEventListener("click", () => {
    alert("Redirigiendo a registro con Facebook…");
  });
}

// === UTIL: Leer Cookie por Nombre ===
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

// === UTIL: Escribir Cookie con Caducidad (días) ===
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

// === Carrito con localStorage + sincronización en cookie ===

const products = {
  articulo1: { name: "Camiseta “Elefantes Unidos”",       price: 18.00, stock: 12 },
  articulo2: { name: "Taza “Salva a los Tigres”",         price: 12.50, stock: 20 },
  articulo3: { name: "Gorra “Protege los Océanos”",       price: 15.00, stock: 15 },
  articulo4: { name: "Póster “Aves Libres”",               price: 8.00,  stock: 25 },
  articulo5: { name: "Bolsa “Adopta un Árbol”",            price: 10.00, stock: 30 },
  articulo6: { name: "Llavero “Salva la Fauna”",           price: 5.00,  stock: 40 },
  articulo7: { name: "Libreta “Bosque Vivo”",              price: 9.00,  stock: 18 },
  articulo8: { name: "Calcetines “Amigos del Oso Polar”",  price: 7.50,  stock: 22 },
  articulo9: { name: "Pegatina “Salva los Corales”",       price: 3.00,  stock: 50 },
  articulo10: { name: "Botella “Agua Limpia para Todos”",  price: 22.00, stock: 10 }
};


// Obtiene el carrito actual (Array) de localStorage; si no existe, lee la cookie “cart” como respaldo
function getCart() {
  const cartLS = localStorage.getItem("cart");
  if (cartLS) {
    try {
      return JSON.parse(cartLS);
    } catch {
      return [];
    }
  }
  // Si no hay en localStorage, intentar leer cookie
  const cartCookie = getCookie("cart");
  if (cartCookie) {
    try {
      return JSON.parse(cartCookie);
    } catch {
      return [];
    }
  }
  return [];
}

// Guarda el carrito (Array) en localStorage Y en cookie (7 días)
function saveCart(cart) {
  const json = JSON.stringify(cart);
  localStorage.setItem("cart", json);
  setCookie("cart", json, 7);
}

// Actualiza el contador que se muestra en el <span id="cart-count">
function updateCartCount() {
  const cart = getCart();
  const countSpan = document.getElementById("cart-count");
  if (countSpan) {
    countSpan.textContent = cart.length; // número total de items
  }
}

// Genera el HTML para cada ítem en el panel de carrito
function renderCartItems() {
  const cartContainer = document.getElementById("cart-items");
  const totalSpan = document.getElementById("cart-total");
  if (!cartContainer || !totalSpan) return;

  const cart = getCart();
  cartContainer.innerHTML = ""; // limpiar

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="empty-cart">Tu carrito está vacío.</p>`;
    totalSpan.textContent = "0.00";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <button class="cart-item-remove" data-index="${index}" aria-label="Eliminar ${item.name}">✕</button>
    `;
    cartContainer.appendChild(itemDiv);
  });

  totalSpan.textContent = total.toFixed(2);

  // Agregar listener a cada botón "✕" para eliminar del carrito
  document.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-index"));
      removeFromCart(idx);
    });
  });
}

// Elimina un ítem del carrito por su índice y vuelve a renderizar
function removeFromCart(index) {
  const cart = getCart();
  if (index < 0 || index >= cart.length) return; // Validar índice
  cart.splice(index, 1);
  saveCart(cart);
  updateCartCount();
  renderCartItems();
}

// Añadir un producto al carrito: recibe id, nombre y precio
function addToCart(id, name, price) {
  const cart = getCart();

  // Contar cuántas unidades de este artículo ya están en el carrito
  const alreadyInCart = cart.filter(item => item.id === id).length;
  const availableStock = products[id].stock;

  // Si no queda stock, avisar y salir
  if (alreadyInCart >= availableStock) {
    alert(`❌ Lo sentimos, no quedan unidades de “${products[id].name}”.`);
    return;
  }

  // Agregar la unidad al carrito
  cart.push({ id, name, price });
  saveCart(cart);
  updateCartCount();

  // Calcular cuántas unidades quedan tras añadir esta
  const remaining = availableStock - (alreadyInCart + 1);

  // Mostrar mensaje indicando cuántas quedan
  if (remaining > 0) {
    alert(`✅ “${products[id].name}” añadida. Quedan ${remaining} unidad${remaining > 1 ? 'es' : ''} en stock.`);
  } else {
    alert(`✅ “${products[id].name}” añadida. Ya no quedan unidades en stock.`);
  }

  // Si el panel del carrito está abierto, actualizarlo en vivo
  const panel = document.getElementById("cart-panel");
  if (panel && panel.classList.contains("visible")) {
    renderCartItems();
  }
}

// Abre el panel (añade clase .visible)
function openCartPanel() {
  const panel = document.getElementById("cart-panel");
  if (panel) {
    panel.classList.add("visible");
    renderCartItems();
  }
}

// Cierra el panel (remueve clase .visible)
function closeCartPanel() {
  const panel = document.getElementById("cart-panel");
  if (panel) {
    panel.classList.remove("visible");
  }
}

// Inicializar eventos del carrito
function initCart() {
  updateCartCount();

  const cartIcon = document.getElementById("cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", openCartPanel);
  }

  const cartClose = document.getElementById("cart-close");
  if (cartClose) {
    cartClose.addEventListener("click", closeCartPanel);
  }

  document.querySelectorAll(".btn-add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (products[id]) {
        addToCart(id, products[id].name, products[id].price);
        alert(`✅ ${products[id].name} añadida al carrito`);
      } else {
        alert("Producto no reconocido.");
      }
    });
  });

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }
      alert("Gracias por tu compra. Serás redirigido al pago.");
      // Por ejemplo: window.location.href = "checkout.html";
    });
  }
}

// === Inicialización al cargar el DOM ===
document.addEventListener('DOMContentLoaded', () => {
  initCardAnimations();
  initScrollTopBtn();
  initCommentSystem();
  initDarkModeToggle();
  initLoginTab();
  initCart();
});
