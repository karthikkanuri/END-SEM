// Users and session are stored in the browser's localStorage (no backend needed).
var USERS_KEY = "lab_users";
var SESSION_KEY = "lab_current_user";
var FLASH_KEY = "lab_flash";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch (e) { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  var email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  return getUsers().find(function (u) { return u.email === email; }) || null;
}

function setMsg(id, text, type) {
  var el = document.getElementById(id);
  el.textContent = text;
  el.className = "msg" + (type ? " " + type : "");
}

// A one-time message shown on the next page (e.g. "Registration successful")
function setFlash(text) { sessionStorage.setItem(FLASH_KEY, text); }
function popFlash() {
  var text = sessionStorage.getItem(FLASH_KEY);
  sessionStorage.removeItem(FLASH_KEY);
  return text;
}

// ---------- Login page (index.html) ----------
function initLoginPage() {
  if (getCurrentUser()) { window.location.href = "home.html"; return; }

  var flash = popFlash();
  if (flash) setMsg("loginMsg", flash, "success");

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("loginEmail").value.trim().toLowerCase();
    var password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      return setMsg("loginMsg", "Enter your email and password.", "error");
    }

    var user = getUsers().find(function (u) {
      return u.email === email && u.password === password;
    });

    if (!user) {
      return setMsg("loginMsg", "Incorrect email or password.", "error");
    }

    localStorage.setItem(SESSION_KEY, user.email);
    window.location.href = "home.html";
  });
}

// ---------- Register page (register.html) ----------
function initRegisterPage() {
  if (getCurrentUser()) { window.location.href = "home.html"; return; }

  document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("regName").value.trim();
    var email = document.getElementById("regEmail").value.trim().toLowerCase();
    var password = document.getElementById("regPassword").value;
    var confirm = document.getElementById("regConfirm").value;

    if (!name || !email || !password || !confirm) {
      return setMsg("regMsg", "Please fill in all fields.", "error");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setMsg("regMsg", "Enter a valid email address.", "error");
    }
    if (password.length < 6) {
      return setMsg("regMsg", "Password must be at least 6 characters.", "error");
    }
    if (password !== confirm) {
      return setMsg("regMsg", "Passwords do not match.", "error");
    }

    var users = getUsers();
    if (users.some(function (u) { return u.email === email; })) {
      return setMsg("regMsg", "This email is already registered. Please log in.", "error");
    }

    users.push({ name: name, email: email, password: password });
    saveUsers(users);
    setFlash("Registration successful. Please log in.");
    window.location.href = "index.html";
  });
}

// ---------- Home page (home.html) ----------
function initHomePage() {
  var user = getCurrentUser();
  if (!user) { window.location.href = "index.html"; return; } // protect page

  document.getElementById("welcomeName").textContent = user.name;
  document.getElementById("welcomeEmail").textContent = user.email;

  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem(SESSION_KEY);
    setFlash("You have been logged out.");
    window.location.href = "index.html";
  });
}
