const API_URL = "https://fakestoreapi.com/products";

let products = [];
let cart = [];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("category");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const ratingSelect = document.getElementById("rating");
const sortSelect = document.getElementById("sort");
const resultText = document.getElementById("resultText");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const fallbackProducts = [
  {
    id: 1,
    title: "Classic White T-Shirt",
    price: 19.99,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    rating: { rate: 4.5, count: 120 },
  },
  {
    id: 2,
    title: "Blue Casual Jacket",
    price: 49.99,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    rating: { rate: 4.1, count: 90 },
  },
  {
    id: 3,
    title: "Silver Chain Bracelet",
    price: 35.5,
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 4.7, count: 80 },
  },
  {
    id: 4,
    title: "Elegant Gold Ring",
    price: 79.99,
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61YA4F7K3tL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 3.9, count: 65 },
  },
  {
    id: 5,
    title: "Women Casual Backpack",
    price: 42.0,
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    rating: { rate: 4.3, count: 110 },
  },
  {
    id: 6,
    title: "Lightweight Handbag",
    price: 59.99,
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/5Qmp4k2mW1eL._AC_UX679_.jpg",
    rating: { rate: 4.0, count: 74 },
  },
  {
    id: 7,
    title: "Wireless Headphones",
    price: 89.99,
    category: "electronics",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    rating: { rate: 4.6, count: 210 },
  },
  {
    id: 8,
    title: "Portable SSD Drive",
    price: 119.99,
    category: "electronics",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
    rating: { rate: 4.4, count: 155 },
  },
];

async function loadProducts() {
  productGrid.innerHTML = '<div class="loading">Loading products...</div>';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Could not load products");
    products = await response.json();
  } catch (error) {
    console.warn("API unavailable, using fallback data.");
    products = fallbackProducts;
  }

  setupCategories();
  priceRange.max = Math.max(
    100,
    Math.ceil(Math.max(...products.map((product) => product.price)) / 50) * 50,
  );
  priceRange.value = priceRange.max;
  priceValue.textContent = priceRange.value;
  renderProducts();
}

function setupCategories() {
  const categories = [
    ...new Set(products.map((product) => product.category)),
  ].sort();
  categorySelect.innerHTML = '<option value="all">All categories</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
    categorySelect.appendChild(option);
  });
}

function renderProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const maxPrice = Number(priceRange.value);
  const minRating = Number(ratingSelect.value);
  const sort = sortSelect.value;

  let filtered = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search);
    const matchesCategory = category === "all" || product.category === category;
    const matchesPrice = product.price <= maxPrice;
    const matchesRating = product.rating.rate >= minRating;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "rating-high")
    filtered.sort((a, b) => b.rating.rate - a.rating.rate);

  resultText.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;

  if (filtered.length === 0) {
    productGrid.innerHTML =
      '<div class="empty"><h3>No products found</h3><p>Try changing your search or filters.</p></div>';
    return;
  }

  productGrid.innerHTML = filtered.map(createProductCard).join("");
}

function createProductCard(product) {
  const stars =
    "★".repeat(Math.round(product.rating.rate)) +
    "☆".repeat(5 - Math.round(product.rating.rate));
  const safeTitle = product.title.replace(/"/g, "&quot;");

  return `
    <article class="product-card">
      <div class="product-image"><img src="${product.image}" alt="${safeTitle}" loading="lazy"></div>
      <div class="product-info">
        <p class="category-name">${product.category}</p>
        <h3 class="product-title">${safeTitle}</h3>
        <p class="rating">${stars} <span>${product.rating.rate} (${product.rating.count})</span></p>
        <div class="product-bottom">
          <p class="price">$${product.price.toFixed(2)}</p>
          <button class="add-btn" data-id="${product.id}">Add to cart</button>
        </div>
      </div>
    </article>`;
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
}

function changeQuantity(id, change) {
  const item = cart.find((product) => product.id === id);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter((product) => product.id !== id);
  updateCart();
}

function updateCart() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  cartCount.textContent = totalItems;
  cartTotal.textContent = totalPrice.toFixed(2);

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}">
      <div>
        <h3>${item.title}</h3>
        <p>$${item.price.toFixed(2)} each</p>
        <div class="qty">
          <button data-action="minus" data-id="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button data-action="plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <div>
        <strong>$${(item.price * item.quantity).toFixed(2)}</strong><br>
        <button class="remove-btn" data-action="remove" data-id="${item.id}">Remove</button>
      </div>
    </div>`,
    )
    .join("");
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.remove("hidden");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.add("hidden");
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-btn");
  if (button) addToCart(Number(button.dataset.id));
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;
  if (action === "plus") changeQuantity(id, 1);
  if (action === "minus") changeQuantity(id, -1);
  if (action === "remove") {
    cart = cart.filter((item) => item.id !== id);
    updateCart();
  }
});

searchInput.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", renderProducts);
ratingSelect.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);
priceRange.addEventListener("input", () => {
  priceValue.textContent = priceRange.value;
  renderProducts();
});

document.getElementById("clearFilters").addEventListener("click", () => {
  searchInput.value = "";
  categorySelect.value = "all";
  ratingSelect.value = "0";
  sortSelect.value = "default";
  priceRange.value = priceRange.max;
  priceValue.textContent = priceRange.value;
  renderProducts();
});

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  alert("Thanks! This demo checkout is ready for integration.");
});

updateCart();
loadProducts();
