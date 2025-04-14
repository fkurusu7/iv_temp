const products = [
  {
    image: "./product.jpg",
    name: "shoes",
    price: "230.89",
    category: "wear",
  },
  {
    image: "./product.jpg",
    name: "trousers",
    price: "5.99",
    category: "wear",
  },
  {
    image: "./product.jpg",
    name: "dinning table",
    price: "238.99",
    category: "wood",
  },
  {
    image: "./product.jpg",
    name: "wig",
    price: "511.99",
    category: "fur",
  },
  {
    image: "./product.jpg",
    name: "bottle",
    price: "3336.99",
    category: "water",
  },
  {
    image: "./product.jpg",
    name: "glasses",
    price: "590.99",
    category: "ophtalmology",
  },
  {
    image: "./product.jpg",
    name: "sandals",
    price: "12.99",
    category: "wood",
  },
];
// DOM Elements
const inventoryContainer = document.getElementById("inventory");
const searchInput = document.getElementById("search");
const priceRangeFilter = document.getElementById("price-range");
const sortSelect = document.getElementById("sort");

// initialize Page
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  setupEventListeners();
});

// Set up event Listeners for all filters
function setupEventListeners() {
  searchInput.addEventListener("input", applyFilters);
  priceRangeFilter.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);
}

// Create HTML for a product card
function createProductCard(product) {
  return `<article class="product">
        <h2 class="product__name">${product.name}</h2>
        <img src="${product.image}" alt="product" class="product__img">
        <p class="product__price">$${product.price}</p>
        <span class="product__category">${product.category}</span>
      </article>`;
}

// Render Products to the DOM
function renderProducts(productsToRender) {
  inventoryContainer.innerHTML = productsToRender
    .map((product) => createProductCard(product))
    .join("");
}

// Apply filters
function applyFilters() {
  let filterProducts = [...products];
  console.log(filterProducts);

  // apply search filter
  const searchTerm = searchInput.value.trim().toLowerCase();
  console.log(searchTerm);
  if (searchTerm) {
    filterProducts = filterProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
  }

  const priceRange = priceRangeFilter.value;
  console.log(priceRange);
  if (priceRange) {
    filterProducts = filterByPriceRange(filterProducts, priceRange);
  }

  const sortOption = sortSelect.value;
  if (sortOption !== "default") {
    sortProducts(filterProducts, sortOption);
  }

  // render products
  console.log(filterProducts);
  renderProducts(filterProducts);
}

function filterByPriceRange(filterProducts, priceRange) {
  if (priceRange === "0-500") {
    return filterProducts.filter((product) => product.price <= 500);
  } else if (priceRange === "500-1000") {
    return filterProducts.filter(
      (product) => product.price > 500 && product.price <= 1000
    );
  } else if (priceRange === "1000+") {
    return filterProducts.filter((product) => product.price > 1000);
  }

  console.log(filterProducts);
  return filterProducts;
}

// Sort by price
function sortProducts(filterProducts, sortOption) {
  if (sortOption === "price-asc") {
    filterProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    filterProducts.sort((a, b) => b.price - a.price);
  }
  console.log(filterProducts);
}
