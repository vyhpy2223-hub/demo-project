(() => {
  const roles = document.querySelectorAll(".role");
  const form = document.getElementById("loginForm");
  const togglePw = document.getElementById("togglePw");
  const pw = document.getElementById("password");

  const saved = localStorage.getItem("aes_role") || "learner";
  setActiveRole(saved);

  roles.forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role;
      localStorage.setItem("aes_role", role);
      setActiveRole(role);
    });
  });

  function setActiveRole(role) {
    roles.forEach(b => {
      const active = b.dataset.role === role;
      b.classList.toggle("active", active);
      b.setAttribute("aria-checked", active ? "true" : "false");
    });
  }

  togglePw?.addEventListener("click", () => {
    pw.type = pw.type === "password" ? "text" : "password";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const role = localStorage.getItem("aes_role") || "learner";
    const map = {
      admin: "../admin/index.html",
      learner: "../learner/index.html",
      mentor: "../mentor/index.html",
    };
    window.location.href = map[role] || "../learner/index.html";
  });
})();