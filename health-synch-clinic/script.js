// Utility functions
function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
}

function setActiveNav(btn) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Nav functionality
document.addEventListener('DOMContentLoaded', function() {
    // Nav buttons
    document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            hideAllSections();
            document.getElementById(sectionId).classList.add('active');
            setActiveNav(this);
        });
    });

    // Login modal
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    closeLogin.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Register modal
    const regBtn = document.getElementById('regBtn');
    const regModal = document.getElementById('regModal');
    const closeReg = document.getElementById('closeReg');

    regBtn.addEventListener('click', () => {
        regModal.style.display = 'block';
    });

    closeReg.addEventListener('click', () => {
        regModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === regModal) {
            regModal.style.display = 'none';
        }
    });

    // Book form
    document.querySelector('.book-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Appointment booked successfully! We\\'ll contact you to confirm.');
        this.reset();
    });

    // Auth forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert(this === document.querySelector('#loginModal .auth-form') 
                ? 'Logged in successfully!' 
                : 'Registration successful! You are verified.');
            this.closest('.modal').style.display = 'none';
            this.reset();
        });
    });

    // Availability button (toggle)
    const availabilityBtn = document.getElementById('availabilityBtn');
    const availabilities = document.querySelectorAll('.availability');
    
    availabilityBtn.addEventListener('click', function() {
        availabilities.forEach(avail => {
            avail.classList.toggle('available');
        });
        const text = this.innerHTML.includes('Available') ? 'Hide Availability' : 'Availability';
        this.innerHTML = '<i class="fas fa-info-circle"></i> ' + text;
    });

    // CTA button on home scrolls to book
    document.querySelector('.cta-btn').addEventListener('click', () => {
        hideAllSections();
        document.getElementById('book').classList.add('active');
        setActiveNav(document.querySelector('.nav-btn[data-section="book"]'));
    });
});
