// MEMBER 1: LOGIN & AUTHENTICATION
// Demo credentials:
// Admin: admin / admin
// User:  user / user

let selectedRole = "user";
let currentRole = "";
let currentUsername = "";

document.querySelectorAll(".role-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".role-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    selectedRole = button.dataset.role;
    document.getElementById("loginError").textContent = "";
  });
});

document.getElementById("loginForm").addEventListener("submit", event => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const valid = selectedRole === "admin"
    ? username === "admin" && password === "admin"
    : username === "user" && password === "user";

  if (!valid) {
    document.getElementById("loginError").textContent =
      "Incorrect login details. Please try again.";
    return;
  }

  currentRole = selectedRole;
  currentUsername = username;

  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("welcomeName").textContent =
    currentRole === "admin" ? "Administrator" : "Hi, " + username;
  document.getElementById("avatar").textContent =
    currentRole === "admin" ? "A" : username.charAt(0).toUpperCase();

  // Customers and admins see different navigation menus.
  document.getElementById("userNav").classList.toggle("hidden", currentRole !== "user");
  document.getElementById("adminNav").classList.toggle("hidden", currentRole !== "admin");

  if (currentRole === "admin") showPage("dashboard");
  else showPage("discover");

  renderApp();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  currentRole = "";
  currentUsername = "";

  document.getElementById("app").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("loginForm").reset();
  document.getElementById("loginError").textContent = "";

  document.querySelector('[data-role="user"]').click();
});

// Sidebar navigation
document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

function showPage(page) {
  document.querySelectorAll(".page").forEach(section => section.classList.add("hidden"));

  const target = document.getElementById(page + "Page");
  if (target) target.classList.remove("hidden");

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  const labels = {
    discover: "Discover",
    myBookings: "My tickets",
    dashboard: "Dashboard",
    manageMovies: "Manage movies",
    allBookings: "Bookings"
  };

  document.getElementById("pageName").textContent = labels[page] || "Discover";
  renderApp();
}
