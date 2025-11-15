// Menu items data
const menuItems = [
    {
        id: 1,
        name: "Chicken Biryani",
        description: "Fragrant basmati rice cooked with tender chicken and aromatic spices",
        price: 250,
        emoji: "🍛"
    },
    {
        id: 2,
        name: "Margherita Pizza",
        description: "Classic pizza with fresh mozzarella, tomato sauce, and basil",
        price: 300,
        emoji: "🍕"
    },
    {
        id: 3,
        name: "Cheese Burger",
        description: "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
        price: 180,
        emoji: "🍔"
    },
    {
        id: 4,
        name: "Creamy Pasta",
        description: "Penne pasta in rich white sauce with mushrooms and herbs",
        price: 220,
        emoji: "🍝"
    },
    {
        id: 5,
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with caesar dressing, croutons, and parmesan",
        price: 150,
        emoji: "🥗"
    },
    {
        id: 6,
        name: "Chocolate Brownie",
        description: "Warm chocolate brownie with vanilla ice cream",
        price: 120,
        emoji: "🍰"
    }
];

// Cart state
let cart = [];

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const overlay = document.getElementById('overlay');
const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const cancelBooking = document.getElementById('cancelBooking');
const orderSummary = document.getElementById('orderSummary');
const successMessage = document.getElementById('successMessage');
const okBtn = document.getElementById('okBtn');

// Initialize app
function init() {
    renderMenu();
    updateCartUI();
    attachEventListeners();
}

// Render menu items
function renderMenu() {
    menuGrid.innerHTML = menuItems.map(item => `
        <div class="menu-item">
            <div class="item-image">${item.emoji}</div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="item-footer">
                    <span class="price">₹${item.price}</span>
                    <button class="add-to-cart" onclick="addToCart(${item.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }

    updateCartUI();
    showNotification(`${item.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartUI();
        }
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

// Open cart
function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

// Close cart
function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Open booking modal
function openBookingModal() {
    if (cart.length === 0) return;
    
    // Generate order summary
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderSummary.innerHTML = `
        <h3>Order Summary</h3>
        ${cart.map(item => `
            <div class="summary-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `).join('')}
        <div class="summary-item" style="margin-top: 10px; padding-top: 10px; border-top: 2px solid #ddd; font-weight: bold;">
            <span>Total</span>
            <span>₹${total}</span>
        </div>
    `;
    
    bookingModal.classList.add('active');
    overlay.classList.add('active');
}

// Close booking modal
function closeBookingModal() {
    bookingModal.classList.remove('active');
    overlay.classList.remove('active');
}

// Show success message
function showSuccessMessage() {
    successMessage.classList.add('active');
    overlay.classList.add('active');
}

// Close success message
function closeSuccessMessage() {
    successMessage.classList.remove('active');
    overlay.classList.remove('active');
    // Reset cart and form
    cart = [];
    updateCartUI();
    bookingForm.reset();
    closeCartSidebar();
}

// Show notification
function showNotification(message) {
    // Simple notification (you can enhance this)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Handle form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const deliveryTime = document.getElementById('deliveryTime').value;
    
    // Simulate booking process
    console.log('Booking Details:', {
        customerName,
        customerPhone,
        customerAddress,
        deliveryTime,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
    
    // Close booking modal and show success
    closeBookingModal();
    setTimeout(() => {
        showSuccessMessage();
    }, 300);
}

// Attach event listeners
function attachEventListeners() {
    cartBtn.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    checkoutBtn.addEventListener('click', openBookingModal);
    cancelBooking.addEventListener('click', closeBookingModal);
    bookingForm.addEventListener('submit', handleBookingSubmit);
    okBtn.addEventListener('click', closeSuccessMessage);
    
    // Close modals when clicking overlay
    overlay.addEventListener('click', () => {
        closeCartSidebar();
        closeBookingModal();
        closeSuccessMessage();
    });
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
init();

