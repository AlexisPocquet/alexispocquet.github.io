// Theme: restore the saved choice right away (this script is loaded in <head>).
const root = document.documentElement;
try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch {}

document.addEventListener("DOMContentLoaded", () => {
  // ◑ button: switch between light and dark, remember the choice.
  document.getElementById("theme").onclick = () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
  };

  // Side menu: highlight the section currently on screen.
  const links = document.querySelectorAll('.tree a[href^="#"]');
  const observer = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.toggle("active", a.hash === "#" + e.target.id));
      }
    }
  }, { rootMargin: "-20% 0px -70% 0px" });
  document.querySelectorAll("main section[id]").forEach(s => observer.observe(s));
});
