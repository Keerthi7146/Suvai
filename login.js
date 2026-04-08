// 1. CUSTOM TOAST NOTIFICATION
function showToast(message, type) {
    const toast = document.getElementById('toastMessage');
    toast.innerText = message;
    toast.className = 'toast show ' + type;
    
    if (type === 'success') {
        toast.innerHTML = '✅ ' + message;
    } else {
        toast.innerHTML = '❌ ' + message;
    }

    setTimeout(() => { toast.className = 'toast'; }, 3500);
}

// 2. BULLETPROOF TAB SWITCHING LOGIC
function switchTab(tabName) {
    const signinBtn = document.getElementById('tab-signin');
    const signupBtn = document.getElementById('tab-signup');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const title = document.getElementById('form-title');
    const subtitle = document.getElementById('form-subtitle');

    // Clear all input boxes automatically
    document.querySelectorAll('input').forEach(input => input.value = '');

    if (tabName === 'signin') {
        // Force display block/none
        signinForm.style.display = 'block';
        signupForm.style.display = 'none';
        
        signinBtn.classList.add('active');
        signupBtn.classList.remove('active');
        
        title.innerText = "Welcome Back";
        subtitle.innerText = "Please enter your details to access your account";
    } else {
        // Force display block/none
        signinForm.style.display = 'none';
        signupForm.style.display = 'block';
        
        signupBtn.classList.add('active');
        signinBtn.classList.remove('active');
        
        title.innerText = "Create Account";
        subtitle.innerText = "Join Suvai to start your premium meal journey";
    }
}

// 3. EYE ICON TOGGLE LOGIC
const togglePasswordIcons = document.querySelectorAll('.toggle-password');
togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const input = this.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            this.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
        } else {
            input.type = 'password';
            this.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
        }
    });
});

// 4. STRICT REGEX VALIDATIONS
function isValidUsername(username) {
    return /^[A-Za-z\s]+$/.test(username); // Only letters & space
}

function isValidPhone(phone) {
    return /^\d+$/.test(phone); // Only numbers
}

function isValidPassword(password) {
    if (password.length < 4) return false;
    
    // First char must be Capital A-Z
    const firstChar = password.charAt(0);
    if (firstChar < 'A' || firstChar > 'Z') return false; 
    
    // Must have at least one digit
    if (!/\d/.test(password)) return false; 
    
    // Remaining must NOT be Capital letters
    for (let i = 1; i < password.length; i++) {
        if (password[i] >= 'A' && password[i] <= 'Z') return false;
    }
    return true;
}

// 5. DATABASE RETRIEVAL
function getUsers() {
    return JSON.parse(localStorage.getItem('suvai_users')) || [];
}

// 6. SIGN UP LOGIC
const btnSignup = document.getElementById('btn-signup');
if(btnSignup) {
    btnSignup.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        const user = document.getElementById('up-user').value.trim();
        const phone = document.getElementById('up-phone').value.trim();
        const pass = document.getElementById('up-pass').value.trim();
        const confirm = document.getElementById('up-confirm').value.trim();

        if (user === "" || phone === "" || pass === "" || confirm === "") {
            showToast("Please fill in all the fields.", "error"); return;
        }
        if (!isValidUsername(user)) {
            showToast("Username must contain only letters.", "error"); return;
        }
        if (!isValidPhone(phone)) {
            showToast("Phone number must contain only numbers.", "error"); return;
        }
        if (!isValidPassword(pass)) {
            showToast("Password must start with Capital letter, contain a number, and rest must be small letters.", "error"); return;
        }
        if (pass !== confirm) {
            showToast("Passwords do not match!", "error"); return;
        }

        const users = getUsers();
        const userExists = users.find(u => u.username === user || u.phone === phone);
        if (userExists) {
            showToast("An account with this username or phone already exists.", "error"); return;
        }

        users.push({ username: user, phone: phone, password: pass });
        localStorage.setItem('suvai_users', JSON.stringify(users));

        showToast("Account created successfully!", "success");
        setTimeout(() => { switchTab('signin'); }, 1500);
    });
}

// 7. SIGN IN LOGIC
const btnSignin = document.getElementById('btn-signin');
if(btnSignin) {
    btnSignin.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        const user = document.getElementById('in-user').value.trim();
        const phone = document.getElementById('in-phone').value.trim();
        const pass = document.getElementById('in-pass').value.trim();

        if (user === "" || phone === "" || pass === "") {
            showToast("Please fill in all the fields.", "error"); return;
        }

        // Admin Backdoor
        if (user === "Admin" && pass === "Admin123") {
            localStorage.setItem('suvai_active_session', 'true'); 
            showToast("Admin Login Successful", "success");
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
            return;
        }

        // Verify from DB
        const users = getUsers();
        const validUser = users.find(u => u.username === user && u.phone === phone && u.password === pass);
        
        if (validUser) {
            localStorage.setItem('suvai_active_session', 'true'); 
            showToast("Login Successful", "success");
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        } else {
            showToast("Invalid Username, Phone number, or Password", "error");
        }
    });
}