/* --- SUVAI CORE JAVASCRIPT --- */

// 1. SESSION MANAGEMENT & UI UPDATE
document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('suvai_active_session') === 'true';

    if (isLoggedIn) {
        // User is logged in: Show Logout, Hide Login
        if(loginBtn) loginBtn.style.display = 'none';
        if(logoutBtn) logoutBtn.style.display = 'flex';
    } else {
        // User is logged out: Show Login, Hide Logout
        if(loginBtn) loginBtn.style.display = 'flex';
        if(logoutBtn) logoutBtn.style.display = 'none';
    }
});

function logoutUser() {
    localStorage.removeItem('suvai_active_session'); // Clear session
    window.location.href = 'index.html'; // Redirect to home
}


// 2. MODAL & SECURITY LOGIC

// Function for general link protection (e.g., in Navbar)
function protectLink(targetUrl) {
    const isLoggedIn = localStorage.getItem('suvai_active_session') === 'true';
    if (isLoggedIn) {
        window.location.href = targetUrl; // Allow access
    } else {
        openAuthWarning(); // Block and show warning
    }
}

// Function to handle "Subscribe" or "Add" actions on home/meal page cards
function protectAction(title, price, desc, imgSrc, type) {
    const isLoggedIn = localStorage.getItem('suvai_active_session') === 'true';
    
    if (isLoggedIn) {
        // User logged in: Open details modal
        if (type === 'city') {
            openCityModal(title, price, desc, imgSrc);
        } else {
            openDetailsModal(title, price, desc, imgSrc);
        }
    } else {
        // User logged out: Show warning modal
        openAuthWarning();
    }
}


// --- MODAL SUB-FUNCTIONS ---

// 1. Authenticated: Open Food/Plan Details Modal
function openDetailsModal(title, price, desc, imgSrc) {
    const modal = document.getElementById("suvaiModal");
    modal.classList.add('open'); 
    
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalPrice").innerText = price;
    document.getElementById("modalDesc").innerText = desc;
    document.getElementById("modalImg").src = imgSrc;

    const btn = document.getElementById("modalActionBtn");
    btn.innerText = "Subscribe Now";
    
    // Save the selected item to localStorage before redirecting to payment page
    btn.onclick = function() { 
        const checkoutItem = {
            title: title,
            price: price,
            desc: desc
        };
        localStorage.setItem('suvai_checkout_item', JSON.stringify(checkoutItem));
        window.location.href = 'payment.html'; 
    };
}

// 2. Authenticated: Open City Details Modal (Specific format)
function openCityModal(title, subtitle, desc, imgSrc) {
    const modal = document.getElementById("suvaiModal");
    modal.classList.add('open'); 
    
    document.getElementById("modalTitle").innerText = "Explore " + title;
    document.getElementById("modalBadge").innerText = "City Hub";
    document.getElementById("modalPrice").innerText = subtitle;
    document.getElementById("modalDesc").innerText = desc;
    document.getElementById("modalImg").src = imgSrc;

    const btn = document.getElementById("modalActionBtn");
    btn.innerText = "Subscribe Now";
    
    // Save the selected item to localStorage before redirecting to payment page
    btn.onclick = function() { 
        const checkoutItem = {
            title: title + " City Plan",
            price: subtitle,
            desc: desc
        };
        localStorage.setItem('suvai_checkout_item', JSON.stringify(checkoutItem));
        window.location.href = 'payment.html'; 
    };
}

// Close standard Details Modal
function closeModal() {
    document.getElementById("suvaiModal").classList.remove('open');
}


// 3. Unauthenticated: Open Security Warning Modal
function openAuthWarning() {
    document.getElementById("authWarningModal").classList.add('open');
}

// Close Security Warning Modal
function closeAuthWarning() {
    document.getElementById("authWarningModal").classList.remove('open');
}

// Close any modal when clicking outside of it
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('open');
    }
}