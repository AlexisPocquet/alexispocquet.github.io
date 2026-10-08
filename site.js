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

  // Maths: if the page contains LaTeX, load KaTeX and render it.
  //   inline:  $x^2$   or  \(x^2\)        display:  $$\int f$$   or  \[\int f\]
  const main = document.querySelector("main");
  if (main && /\$|\\\(|\\\[/.test(main.textContent)) loadMaths(main);
});

function loadMaths(el) {
  const cdn = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/";
  const script = src => new Promise((ok, fail) => {
    const s = document.createElement("script");
    s.src = cdn + src; s.onload = ok; s.onerror = fail;
    document.head.append(s);
  });
  const css = document.createElement("link");
  css.rel = "stylesheet"; css.href = cdn + "katex.min.css";
  document.head.append(css);
  script("katex.min.js")
    .then(() => script("contrib/auto-render.min.js"))
    .then(() => renderMathInElement(el, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    }));
}
