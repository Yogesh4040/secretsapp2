function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());

  const res = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const msg = await res.json();
  const msgBox = document.getElementById("registerMsg");
  msgBox.innerText = msg.message;
  msgBox.style.color = res.ok ? "green" : "red";

  if (res.ok) setTimeout(() => (window.location.href = "/login.html"), 1000);
});

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const msg = await res.json();
  const msgBox = document.getElementById("loginMsg");
  msgBox.innerText = msg.message;
  msgBox.style.color = res.ok ? "green" : "red";

  if (res.ok) setTimeout(() => (window.location.href = "/dashboard"), 1000);
});
