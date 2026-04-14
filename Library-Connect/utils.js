// Shared Utilities for LodgeHub
document.addEventListener('DOMContentLoaded', function() {
    // Common Search Function (for index.html)
    if (document.getElementById('search-input')) {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const searchResults = document.getElementById('search-results');
        
        const demoBooks = [
            { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
            { title: '1984', author: 'George Orwell', year: 1949 },
            { title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
            { title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813 },
            { title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951 }
        ];
        
        function performSearch(query) {
            const results = demoBooks.filter(book => 
                book.title.toLowerCase().includes(query.toLowerCase()) ||
                book.author.toLowerCase().includes(query.toLowerCase())
            );
            
            if (results.length === 0) {
                searchResults.innerHTML = '<p class="no-results">No books found matching "' + query + '".</p>';
                return;
            }
            
            searchResults.innerHTML = results.map(book => 
                `<div class="book-card">
                    <h4>${book.title}</h4>
                    <p class="author">${book.author}</p>
                    <p class="year">${book.year}</p>
                </div>`
            ).join('');
        }
        
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) performSearch(query);
        });
        
        searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') searchBtn.click();
        });
    }
    
    // Auth Modal Handler (for pages with it)
    const loginBtn = document.getElementById('login-btn');
    const regBtn = document.getElementById('reg-btn');
    const authModal = document.getElementById('auth-modal');
    
    if (loginBtn && authModal) {
        loginBtn.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = 'Login';
            authModal.classList.remove('hidden');
        });
    }
    
    if (regBtn && authModal) {
        regBtn.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = 'Register';
            authModal.classList.remove('hidden');
        });
    }
    
    const closeButtons = document.querySelectorAll('.close, #close-overdue');
    closeButtons.forEach(btn => btn?.addEventListener('click', () => {
        authModal?.classList.add('hidden');
    }));
    
    authModal?.addEventListener('click', e => {
        if (e.target === authModal) authModal.classList.add('hidden');
    });
    
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', e => {
            e.preventDefault();
            const action = document.getElementById('modal-title').textContent.toLowerCase();
            alert(`${action.charAt(0).toUpperCase() + action.slice(1)} successful! Redirecting to dashboard...`);
            authModal.classList.add('hidden');
            authForm.reset();
        });
    }
    
    // Nav active state (for multi-page, use URL)
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelector(`nav a[href="${current}"]`)?.classList.add('active');
});
