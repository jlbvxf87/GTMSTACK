const header = document.querySelector(".site-header");

function syncHeaderShadow() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

window.addEventListener("scroll", syncHeaderShadow, { passive: true });
syncHeaderShadow();
