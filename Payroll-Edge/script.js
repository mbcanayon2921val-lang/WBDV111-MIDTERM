document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const taxViewBtn = document.getElementById('tax-view-btn');
    const taxInfoModal = document.getElementById('tax-info');
    const closeModals = document.querySelectorAll('.close-modal');
    const btnViews = document.querySelectorAll('.btn-view');

    // Nav functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Auth tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(targetTab + '-form').classList.add('active');
        });
    });

    // Auth forms
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Logged in securely! Redirecting to dashboard.');
        document.querySelector('a[href="#home"]').click();
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Account created! Please check your email for verification.');
        document.querySelector('a[href="#login-form"]').click(); // Switch to login
    });

    // Tax info modal
    taxViewBtn.addEventListener('click', function() {
        taxInfoModal.classList.remove('hidden');
    });

    closeModals.forEach(close => {
        close.addEventListener('click', function() {
            this.closest('.info-modal').classList.add('hidden');
        });
    });

    taxInfoModal.addEventListener('click', function(e) {
        if (e.target === taxInfoModal) {
            taxInfoModal.classList.add('hidden');
        }
    });

    // Staff view buttons (demo)
    btnViews.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Staff details view - Full profile loading...');
        });
    });

    // Payslip downloads (demo)
    document.querySelectorAll('.payslip-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Downloading payslip PDF...');
        });
    });
});
