/**
 * Cafeteria Project Core Script
 */

const App = {
  foodItems: [],
  cart: [],
  currentUser : {},
  init() {
    this.highlightNavbar();
    if (document.querySelector(".side-navbar")) {
      this.initDashboard();
    }
    this.getcurrentUserData();
    this.getcartItems();
    this.getFoodItems();
    this.showMenu();
    this.setUpMenuListener();
    this.renderCardSummary();
    this.setUpCartListener();
    this.checkoutListener();
    this.loadUserProfile();
  },

  highlightNavbar() {
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".navbar a").forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === currentPath,
      );
    });
  },

  initDashboard() {
    const syncSidebar = () => {
      const currentHash = window.location.hash || "#menu";
      this.updateActiveLinks(currentHash);
      this.toggleSections(currentHash);
    };

    window.addEventListener("hashchange", syncSidebar);
    syncSidebar(); // Initial run
  },

  updateActiveLinks(hash) {
    document.querySelectorAll(".side-navbar a").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === hash);
    });
  },

  toggleSections(hash) {
    document
      .querySelectorAll(".dashboard-wrapper > section")
      .forEach((section) => {
        section.style.display = `#${section.id}` === hash ? "block" : "none";
      });
  },

  /* get Json response of available food items */
  async getFoodItems() {
    const data = await fetch("./db.json");
    this.foodItems = await data.json();
  },

  /* show Menu on Menu section */
  showMenu() {
    // Select all cards in the menu overview
    const menuCards = document.querySelectorAll(".menu-card .card");
    const subSections = document.querySelectorAll(
      '#menu section[id$="-items"]',
    );

    // Hide all sub-sections initially
    subSections.forEach((section) => (section.style.display = "none"));

    menuCards.forEach((card) => {
      card.addEventListener("click", () => {
        // Hide all open sub-sections first
        subSections.forEach((section) => (section.style.display = "none"));
        this.getFoodDetailsByCategory(card.id);
      });
    });
  },
  /* get food details by category on Menu section */
  getFoodDetailsByCategory(cardCategory) {
    const currentFoodItem = this.foodItems[cardCategory];
    // 2. Target ID based on cardCategory ID (e.g., "breakfast" -> "breakfast-items")
    const targetId = `${cardCategory}-items`;
    const targetSection = document.getElementById(targetId);
    const foodItemsContainer = targetSection.querySelector(".food-items");

    if (targetSection) {
      targetSection.style.display = "block";
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    foodItemsContainer.innerHTML = "";
    currentFoodItem.forEach((foodItem) => {
      foodItemsContainer.insertAdjacentHTML(
        "beforeend",
        this.displayFoodItemsHTML(foodItem, cardCategory),
      );
    });
  },

  /* only use in getFoodDetails to display food items on Menu section */
  displayFoodItemsHTML(foodItem, category) {
    return `<div>
                  <img src="${foodItem.image}" alt="${foodItem.alt}" />
                  <h4>${foodItem.name}</h4>
                  <h5>Price:${foodItem.price}</h5>
                  <button type="submit" data-id=${foodItem.id} class="add-to-cart" data-category=${category}>Add to cart</button>
            </div>`;
  },

  /* Menu listener- used to  add cart dynamically on click of add to cart*/
  /* Need initilization */
  setUpMenuListener() {
    const menuSection = document.getElementById("menu");
    menuSection.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart")) {
        const id = parseInt(e.target.dataset.id);
        const category = e.target.dataset.category;
        this.handleAddToCart(id, category);
      }
    });
  },

  /* Add to cart on menu section when user clicks on add to cart button */
  handleAddToCart(id, category) {
    const cartItem = this.foodItems[category].find((item) => item.id === id);
    this.getcartItems();
    const existingItem = this.cart.find((c) => c.id == cartItem.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ ...cartItem, quantity: 1, itemId: `${category}-${id}` });
    }
    alert(`${cartItem.name} - Item added into the cart`);
    this.saveCart();
  },

  /* save cart details on local storage */
  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.renderCardSummary();
  },

  /* get cart details from local storage */
  getcartItems() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
  },

  removeItemFromCart(cartItem) {
    alert("Are you sure to remove this item");
    this.cart = this.cart.filter((item) => item.itemId !== cartItem.itemId);
    this.saveCart();
  },

  /* Cart Section details */
  renderCardSummary() {
    const cartContainer = document.getElementById("cart-summary-container");
    cartContainer.innerHTML = "";
    const cartLength = this.cart.length;
    if (cartLength > 0) {
      this.cart.forEach((element) => {
        element["totalPrice"] = element.price * element.quantity;
        cartContainer.insertAdjacentHTML(
          "beforeend",
          this.getCartListHTML(element),
        );
      });
      const totalAmount = this.cart.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );
      const totalDiv = `<div class="cart-summary-total">
      <span>Total: ${totalAmount}</span>   
      <button class="checkout-btn" data-id="cart-checkout">Checkout</button>
    </div>`;
      cartContainer.insertAdjacentHTML("beforeend", totalDiv);
    } else {
      cartContainer.innerHTML = "Your cart is Empty..";
    }
  },

  /* checkout to all items */
  checkoutListener() {
    const cartContainer = document.getElementById("cart-summary-container");
    cartContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("checkout-btn")) {
        alert("Checkout successfull!");
        this.cart = [];
        this.saveCart();
      }
    });
  },

  /* get cart item HTML to display on cart section */
  getCartListHTML(cartItem) {
    return `<div class="cart-summary-item" data-id="${cartItem.itemId}">
        <span>${cartItem.name}</span>
        <span><img src="${cartItem.image}" alt="${cartItem.alt}" /></span>
        <span><a class="decrement" data-id="${cartItem.itemId}-inc"> - </a> <span class="cart-quantity">${cartItem.quantity}</span> <a class="increment" data-id="${cartItem.itemId}-dec"> + </a></span>
        <span class="cart-item-total">Rs.${cartItem.totalPrice}</span>
        <button class="btn-delete" data-id="${cartItem.itemId}-btn">Remove</button>
    </div>`;
  },

  /* cart listener when any event fire on cick of cart section page */
  setUpCartListener() {
    const cartContainer = document.getElementById("cart-summary-container");
    cartContainer.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      if (id) {
        const itemId = id.substring(0, id.lastIndexOf("-"));
        const selectedItem = this.cart.find((item) => item.itemId == itemId);
        if (!selectedItem) return;
        if (e.target.classList.contains("btn-delete")) {
          this.removeItemFromCart(selectedItem);
          this.renderCardSummary(); //render entire cart
        } else if (e.target.classList.contains("decrement")) {
          selectedItem.quantity -= 1;
          if (selectedItem.quantity < 1) {
            this.removeItemFromCart(selectedItem);
            this.renderCardSummary();
            return;
          }
        } else if (e.target.classList.contains("increment")) {
          selectedItem.quantity += 1;
        }
        this.saveCart();
      }
    });
  },

  /* get current user Data */
  getcurrentUserData() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  },

  /* Render User Profile */
  loadUserProfile() {
    const profile = document.getElementById('profile-section');
    if(this.currentUser) {
    const userDiv = `<div class="user-profile">
            <div class="user-profile-item"><span>User Name: </span>${this.currentUser.userName}</div>
            <div class="user-profile-item"><span>User Email:</span> ${this.currentUser.userEmail}</div>
            <div class="user-profile-item"><span>User Contact: </span>${this.currentUser.userContact}</div>
          </div>`;
      profile.insertAdjacentHTML('beforeend', userDiv);
    }

  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
