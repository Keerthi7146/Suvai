function togglePassword() {
    let pass = document.getElementById("password");
    pass.type = pass.type === "password" ? "text" : "password";
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let message = document.getElementById("message");

    // 🔐 Specified Credentials
    const validUsername = "Admin";
    const validPassword = "Suvai12345";

    if (username === "" || password === "") {
        message.style.color = "red";
        message.innerText = "Please fill all fields!";
        return;
    }

    if (username === validUsername && password === validPassword) {
        message.style.color = "green";
        message.innerText = "Login Successful! Redirecting...";

        setTimeout(() => {
            alert("Welcome to Suvai Dashboard!");
            // You can later redirect like:
            // window.location.href = "home.html";
        }, 1500);

    } else {
        message.style.color = "red";
        message.innerText = "Invalid Username or Password!";
    }
}