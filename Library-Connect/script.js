// Functional Navigation and Interactions
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-btn');
    const overdueBtn = document.getElementById('overdue-btn');
    const overdueSection = document.getElementById('overdue');
    const closeOverdue = document.getElementById('close-overdue');
    
    const loginBtn = document.getElementById('login-btn');
    const regBtn = document.getElementById('reg-btn');
    const authModal = document.getElementById('auth-modal');
    const modalTitle = document.getElementById('modal-title');
    const authForm = document.getElementById('auth-form');
    const closeModal = document.querySelector('.close');
    
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
    
    function showSection(id) {
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }
    
    // Overdue Button
    overdueBtn.addEventListener('click', function() {
        showSection('overdue');
        overdueSection.classList.remove('hidden');
    });
    
    closeOverdue.addEventListener('click', function() {
        overdueSection.classList.add('hidden');
    });
    
    // Auth Modal
    loginBtn.addEventListener('click', function() {
        modalTitle.textContent = 'Login';
        authModal.classList.remove('hidden');
    });
    
    regBtn.addEventListener('click', function() {
        modalTitle.textContent = 'Register';
        authModal.classList.remove('hidden');
    });
    
    closeModal.addEventListener('click', function() {
        authModal.classList.add('hidden');
    });
    
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.classList.add('hidden');
        }
    });
    
    // Auth Form Submission
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(authForm);
        const action = modalTitle.textContent.toLowerCase();
        alert(`${action.charAt(0).toUpperCase() + action.slice(1)} successful! Welcome to LodgeHub.`);
        authModal.classList.add('hidden');
        authForm.reset();
    });
    
    // Search Functionality (demo data)
    const demoBooks = [
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
        { title: '1984', author: 'George Orwell' },
        { title: 'To Kill a Mockingbird', author: 'Harper Lee' }
    ];
    
    function performSearch(query) {
        const results = demoBooks.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase())
        );
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No books found.</p>';
            return;
        }
        
        searchResults.innerHTML = results.map(book =>
            `<div class="book-result">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
            </div>`
        ).join('');
    }
    
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    // Default to search section
    showSection('search');
});
