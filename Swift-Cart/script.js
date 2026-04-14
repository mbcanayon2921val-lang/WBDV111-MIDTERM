let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [
    { id: 1, name: 'Resort T-Shirt', price: 29.99, image: '👕', category: 'Apparel' },
    { id: 2, name: 'Beach Towel', price: 39.99, image: '🛁', category: 'Accessories' },
    { id: 3, name: 'Spa Gift Card', price: 99.99, image: '💆‍♀️', category: 'Wellness' },
    { id: 4, name: 'Resort Mug', price: 19.99, image: '☕', category: 'Souvenirs' },
    { id: 5, name: 'Swim Trunks', price: 49.99, image: '🏊', category: 'Apparel' },
    { id: 6, name: 'Sunglasses', price: 89.99, image: '🕶️', category: 'Accessories' },
    { id: 7, name: 'Massage Voucher', price: 149.99, image: '💆', category: 'Wellness' },
    { id: 8, name: 'Keychain', price: 9.99, image: '🗝️', category: 'Souvenirs' }
];

function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => addToCart(product);
        card.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    // Visual feedback
    const btn = event.target.closest('.add-to-cart');
    btn.textContent = 'Added!';
    btn.style.background = '#27ae60';
    setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
    }, 1000);
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const totalAmount = document.getElementById('totalAmount');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty<br><small>Browse products to get started</small></div>';
        cartTotal.style.display = 'none';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-img">${item.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div>$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <div>$${(item.price * item.quantity).toFixed(2)}</div>
        `;
        cartItems.appendChild(div);
        total += item.price * item.quantity;
    });
    
    totalAmount.textContent = total.toFixed(2);
    cartTotal.style.display = 'block';
}

function goToShipping() {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'shipping.html';
}

// Initialize
renderProducts();
updateCart();

// Category filter
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.nav a.active').classList.remove('active');
        link.classList.add('active');
        
        const category = link.textContent.trim();
        if (category === 'All Products') {
            renderProducts();
        } else {
            // Simple filter (expand as needed)
            alert(`Filtering by ${category}`);
        }
    });
});
