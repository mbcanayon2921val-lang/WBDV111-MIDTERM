const cakeData = [
    { name: "Midnight Truffle", price: 1280, category: "Chocolate", desc: "Deep dark chocolate with a silky ganache.", img: "https://pinoycupidgifts.com/wp-content/uploads/2023/06/Midnight-Choco-Truffle-Kumori.jpg" },
    { name: "Velvet Strawberry", price: 1240, category: "Fruit", desc: "Fresh strawberries whipped into light cream.", img: "https://laneandgreyfare.com/wp-content/uploads/2022/02/Strawberry-Red-Velvet-Cake-1-500x375.jpg" },
    { name: "Golden Honey", price: 980, category: "Classic", desc: "Local honey infused into a crunchy crust.", img: "https://images.squarespace-cdn.com/content/v1/561cc03be4b01e97b62b57e4/1656576764394-32Z68P473110U6Z1AM81/IMG_2544-4.jpg?format=2500w" },
    { name: "Vanilla Bean", price: 1080, category: "Classic", desc: "Authentic Madagascan vanilla bean sponge.", img: "https://th.bing.com/th/id/OIP.0Rc2PabYW3vs-pPv8zEowAHaFj?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"},
    { name: "Caramel Crunch", price: 1120, category: "Specialty", desc: "Salted caramel with toasted almond bits.", img: "https://static.wixstatic.com/media/94b0b4_d90c8a8301b7489394ec9759da336d66~mv2.jpg/v1/fill/w_2880,h_1617,al_c,q_90/Caramel-Coffee%20Crunch%20Cake.JPG" },
    { name: "Pistachio Dream", price: 1320, category: "Specialty", desc: "Roasted pistachios and white chocolate glaze.", img: "https://substackcdn.com/image/fetch/$s_!vZ0Q!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3effd68a-8890-4a4c-8d48-46d38c984d2c_2610x3251.jpeg" },
    { name: "Lemon Zest", price: 1000, category: "Fruit", desc: "Zesty lemon curd on a shortbread base.", img: "https://images.deliveryhero.io/image/menu-import-gateway-prd/regions/AS/chains/klikit_PH/a2f4576e78b8d8d54f582150818d5b2e.jpg?width=%s" },
    { name: "Berry Cheesecake", price: 1180, category: "Cheesecake", desc: "NY style cheesecake with forest berries.", img: "https://images.deliveryhero.io/image/fd-ph/LH/rp8g-listing.jpg" },
    { name: "Dark Forest", price: 1260, category: "Chocolate", desc: "Cherries and chocolate with whipped kirsch.", img: "https://www.redribbon.ph/images/products/Black%20Forest%20Regular.webp?version=1.67.0.1773024527912" },
    { name: "Espresso Cream", price: 1150, category: "Specialty", desc: "Rich coffee layers for the caffeine lovers.", img: "https://tse2.mm.bing.net/th/id/OIP.tHAN8i5A_kcNxRBs34iiUQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" }
];

const banners = [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200",
    "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=1200",
    "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=1200"
];

const CART_KEY = "lodgeHubCart";
const AUTH_KEY = "lodgeHubAuth";

let cart = [];
let bannerIdx = 0;
let pendingItem = null;
let currentFilter = "";
let currentCategory = 'All';
let bannerDots = [];
const bestSellers = [
    { name: "Midnight Truffle", price: 1280, img: "https://pinoycupidgifts.com/wp-content/uploads/2023/06/Midnight-Choco-Truffle-Kumori.jpg" },
    { name: "Espresso Cream", price: 1150, img: "https://tse2.mm.bing.net/th/id/OIP.tHAN8i5A_kcNxRBs34iiUQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { name: "Red Velvet Cheesecake", price: 1400, img: "https://laneandgreyfare.com/wp-content/uploads/2022/02/Strawberry-Red-Velvet-Cake-1-500x375.jpg" },
    { name: "Dulce De Leche Cheesecake", price: 1000, img: "https://images.deliveryhero.io/image/menu-import-gateway-prd/regions/AS/chains/klikit_PH/a2f4576e78b8d8d54f582150818d5b2e.jpg?width=600" },
    { name: "Berry Cheesecake", price: 1180, img: "https://images.deliveryhero.io/image/fd-ph/LH/rp8g-listing.jpg" },
    { name: "Pistachio Dream", price: 1320, img: "https://substackcdn.com/image/fetch/$s_!vZ0Q!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3effd68a-8890-4a4c-8d48-46d38c984d2c_2610x3251.jpeg" },
    { name: "Caramel Crunch", price: 1120, img: "https://static.wixstatic.com/media/94b0b4_d90c8a8301b7489394ec9759da336d66~mv2.jpg/v1/fill/w_2880,h_1617,al_c,q_90/Caramel-Coffee%20Crunch%20Cake.JPG" },
    { name: "Devil's Food Cheesecake", price: 1280, img: "https://images.squarespace-cdn.com/content/v1/561cc03be4b01e97b62b57e4/1656576764394-32Z68P473110U6Z1AM81/IMG_2544-4.jpg?format=2500w" }
];

// Generate cake dropdown HTML
const cakeDropdownHtml = cakeData.map(cake => 
    `<a href="#" class="dropdown-cake" onclick="quickCakeAdd('${cake.name}', ${cake.price}); return false;">${cake.name} - ${formatPeso(cake.price)}</a>`
).join('');

// Load Nav Function
function loadNav() {
    const container = document.getElementById('nav-container');
    if (container && !container.innerHTML) {
        fetch('nav.html')
            .then(res => res.text())
            .then(html => {
                container.innerHTML = html;
                setupCategoryButtons();
                updateCartCountDisplay();
                checkAuth(); // Re-check after load
            })
            .catch(err => console.error('Nav load failed:', err));
    }
}

// Setup Category Filter Buttons (nav)
function setupCategoryButtons() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.category;
            currentCategory = cat;
            currentFilter = cat;
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCakes(currentFilter);
        });
    });
}

// Setup Banner Dots
function setupBannerDots() {
    const dotsContainer = document.getElementById('banner-dots');
    if (dotsContainer) {
        bannerDots = [];
        dotsContainer.innerHTML = '';
        banners.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (idx === bannerIdx) dot.classList.add('active');
            dot.addEventListener('click', () => goToBanner(idx));
            dotsContainer.appendChild(dot);
            bannerDots.push(dot);
        });
    }
}

function goToBanner(idx) {
    bannerIdx = idx;
    const img = document.getElementById('carousel-img');
    if (img) {
        img.style.opacity = 0;
        setTimeout(() => {
            img.src = banners[bannerIdx];
            img.style.opacity = 1;
            updateThumbs();
        }, 400);
    }
}

function updateThumbs() {
    document.querySelectorAll('.thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === bannerIdx);
    });
}

document.getElementById('prev-btn')?.addEventListener('click', () => goToBanner((bannerIdx - 1 + banners.length) % banners.length));
document.getElementById('next-btn')?.addEventListener('click', () => goToBanner((bannerIdx + 1) % banners.length));

function rotateBanner() {
    goToBanner((bannerIdx + 1) % banners.length);
}

function updateBannerDots() {
    bannerDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === bannerIdx);
    });
}

// Initialization
window.onload = () => {
    cart = loadCartFromStorage();
    checkAuth();
    updateCartCountDisplay();
    
    loadNav();
    
    renderCakes(currentFilter);
    
    // Home search
    const homeSearch = document.getElementById('home-search');
    if (homeSearch) {
        homeSearch.addEventListener('input', (e) => {
            renderCakes(e.target.value.toLowerCase());
        });
    }
    
    // Category filters in shop (existing)
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.category || btn.dataset.category === '' ? '' : btn.dataset.category;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCakes(currentFilter);
        });
    });

    setupBannerDots();
    renderBestSellers();
    
    setInterval(rotateBanner, 4000);
    updateCart();
};

function renderCakes(filter = "") {
    const fullGrid = document.getElementById('full-grid');
    const trendGrid = document.getElementById('trending-grid');
    const cakesGrid = document.getElementById('cakes-grid');
    
    if (fullGrid) fullGrid.innerHTML = '';
    if (trendGrid) trendGrid.innerHTML = '';
    if (cakesGrid) cakesGrid.innerHTML = '';

    cakeData.forEach((cake, idx) => {
        const matchesCategory = currentCategory === 'All' || cake.category === currentCategory;
        const matchesSearch = !filter || 
            cake.name.toLowerCase().includes(filter) || 
            cake.category.toLowerCase().includes(filter.toLowerCase());
        
        if (matchesCategory && matchesSearch) {
            const html = `
                <div class="cake-card">
                    <span class="category-tag">${cake.category}</span>
                    <img src="${cake.img}" style="width:100%; height:180px; object-fit:cover; border-radius:12px;">
                    <h3>${cake.name}</h3>
                    <p style="font-size:0.85rem; opacity:0.9; color:var(--text-secondary);">${cake.desc}</p>
                    <p class="cake-price">${formatPeso(cake.price)}</p>
                    <button class="btn-primary" onclick="askConfirm('${cake.name}', ${cake.price})" style="width:100%;">Add to Cart</button>
                </div>`;
            
            if (fullGrid) fullGrid.innerHTML += html;
            if (trendGrid && idx < 3 && filter === "") trendGrid.innerHTML += html;
            if (cakesGrid) cakesGrid.innerHTML += html;
        }
    });
}

function renderBestSellers() {
    const track = document.getElementById('best-sellers-track');
    const prevBtn = document.getElementById('best-sellers-prev');
    const nextBtn = document.getElementById('best-sellers-next');

    if (!track || !prevBtn || !nextBtn) return;

    track.innerHTML = bestSellers.map(cake => `
        <article class="best-seller-card">
            <img src="${cake.img}" alt="${cake.name}">
            <h3>${cake.name}</h3>
            <p class="price">${formatPeso(cake.price)}</p>
        </article>
    `).join('');

    const updateButtons = () => {
        const maxScrollLeft = track.scrollWidth - track.clientWidth;
        prevBtn.disabled = track.scrollLeft <= 4;
        nextBtn.disabled = track.scrollLeft >= maxScrollLeft - 4;
    };

    const getScrollAmount = () => {
        const firstCard = track.querySelector('.best-seller-card');
        if (!firstCard) return 320;
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        return firstCard.offsetWidth + gap;
    };

    prevBtn.onclick = () => track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    nextBtn.onclick = () => track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });

    track.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    requestAnimationFrame(updateButtons);
}

function formatPeso(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2
    }).format(amount);
}

function rotateBanner() {
    bannerIdx = (bannerIdx + 1) % banners.length;
    const img = document.getElementById('carousel-img');
    if (img) {
        img.style.opacity = 0;
        setTimeout(() => {
            img.src = banners[bannerIdx];
            img.style.opacity = 1;
        }, 400);
    }
}

function askConfirm(name, price) {
    pendingItem = { name, price };
    const modal = document.getElementById('cart-modal');
    const msg = document.getElementById('modal-msg');
    const qtyBox = document.getElementById('qty-box');

    msg.innerText = `Add ${name} to your cart?`;
    qtyBox.style.display = 'none';
    modal.style.display = 'flex';
    
    document.getElementById('modal-yes').onclick = () => {
        if (qtyBox.style.display === 'none') {
            msg.innerText = "How many would you like?";
            qtyBox.style.display = 'block';
        } else {
            finalizeAdd();
        }
    };
}

function finalizeAdd() {
    const qty = parseInt(document.getElementById('item-qty').value) || 1;
    cart.push({ ...pendingItem, qty, id: Date.now() });
    updateCart();
    closeModal();
    showToast(`Added ${qty}x ${pendingItem.name} to cart!`);
}

function closeModal() {
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('item-qty').value = 1;
    pendingItem = null;
}

document.getElementById('modal-no')?.addEventListener('click', closeModal);

function updateCart() {
    updateCartCountDisplay();
    const list = document.getElementById('cart-items');
    if (!list) return;
    
    list.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        list.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${formatPeso(item.price * item.qty)}</td>
                <td><button onclick="removeItem(${item.id})" style="background:none;border:none;color:var(--accent);font-size:1.2rem;cursor:pointer;">✕</button></td>
            </tr>`;
        total += item.price * item.qty;
    });
    document.getElementById('total-price').innerText = formatPeso(total);
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
    showToast('Item removed from cart.');
}

function clearCart() {
    cart = [];
    updateCart();
    showToast('Cart cleared.');
}

function loadCartFromStorage() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
}

function getCartQtyCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartCountDisplay() {
    const count = getCartQtyCount();
    document.querySelectorAll('#cart-count').forEach(el => el.innerText = count);
    saveCartToStorage();
}

// Auth functions
function checkAuth() {
    try {
        const auth = JSON.parse(localStorage.getItem(AUTH_KEY));
        const loginLink = document.querySelector('a[href="login.html"]');
        if (auth?.loggedIn && loginLink) {
            loginLink.textContent = 'Logout';
            loginLink.href = '#';
            loginLink.onclick = logout;
        }
    } catch {}
}

function fakeLogin(email) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({email, loggedIn: true}));
    checkAuth();
    showToast(`Welcome back, ${email}!`);
    setTimeout(() => window.location.href = 'index.html', 1500);
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    showToast('Logged out.');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

function quickCakeAdd(name, price) {
    pendingItem = { name, price };
    const modal = document.getElementById('cart-modal');
    if (modal) {
        const msg = document.getElementById('modal-msg');
        const qtyBox = document.getElementById('qty-box');
        msg.innerText = `Add ${name} to your cart?`;
        qtyBox.style.display = 'none';
        modal.style.display = 'flex';
        
        document.getElementById('modal-yes').onclick = () => {
            if (qtyBox.style.display === 'none') {
                msg.innerText = "How many would you like?";
                qtyBox.style.display = 'block';
            } else {
                finalizeAdd();
            }
        };
    }
}

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}
