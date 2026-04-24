let isModalOpen = false;
let contrastToggle = false;

let isMenuOpen = false;

// Prevent browser from restoring scroll position (fixes mobile auto-jump)
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function toggleMenu(forceClose = false) {
  if (forceClose) {
    isMenuOpen = false;
  } else {
    isMenuOpen = !isMenuOpen;
  }

  document.body.classList.toggle("menu--open", isMenuOpen);

  updateThemeIcons();
}

/* =========================
   DARK MODE
========================= */
  function updateThemeIcons() {
  document
    .querySelectorAll(".desktop-only i, .mobile-only i")
    .forEach((icon) => {
      icon.className = contrastToggle
        ? "fa-solid fa-sun"
        : "fa-solid fa-circle-half-stroke";
    });
}

function toggleContrast() {
  contrastToggle = !contrastToggle;
  document.body.classList.toggle("dark-theme", contrastToggle);

  if (contrastToggle) {
    backLayer.start();
    midLayer.start();
    frontLayer.start();
  } else {
    backLayer.stop();
    midLayer.stop();
    frontLayer.stop();
  }

  // Mobile text
document.querySelectorAll(".mobile-only").forEach((el) => {
  el.textContent = contrastToggle ? "🔆 Light Mode 🔆" : "🔥 Dark Mode 🔥";
});

updateThemeIcons();
}

/* =========================
   MODAL
========================= */
function toggleModal() {
  isModalOpen = !isModalOpen;
  document.body.classList.toggle("modal--open", isModalOpen);
}

function closeModalIfOpen() {
  if (isModalOpen) {
    isModalOpen = false;
    document.body.classList.remove("modal--open");
  }
}

function openModalFromBottom() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  setTimeout(() => {
    toggleModal();
  }, 350);
}

/* =========================
   MOUSE PARALLAX
========================= */
let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.02;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.02;
});

/* =========================
   MATRIX LAYER FACTORY
========================= */
function createMatrix(canvasId, speedMultiplier, fadeStrength, blurOffset) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  let animationId = null;
  let columns, drops;
  let trailLengths;
  let columnChars;

  const letters = "01";
  const fontSize = 14;

  function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    columns = canvas.width / fontSize;
    drops = Array(Math.floor(columns)).fill(1);

    columnChars = Array(Math.floor(columns))
      .fill(0)
      .map(() =>
        Array(30)
          .fill(0)
          .map(() => letters[Math.floor(Math.random() * letters.length)]),
      );

    trailLengths = Array(Math.floor(columns))
      .fill(0)
      .map(() => Math.floor(Math.random() * 15) + 8);
  }

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--matrix-color")
      .trim();

    ctx.shadowColor = `rgba(${color}, 0.1)`;
    ctx.shadowBlur = 0;
    ctx.font = fontSize + "px monospace";

    drops.forEach((y, i) => {
      const x = i * fontSize + mouseX * blurOffset;
      const trailLength = trailLengths[i];

      // smooth motion (no flicker)
      if (Math.random() > 0.97) {
        drops[i] += speedMultiplier;
      } else {
        drops[i] += speedMultiplier * 0.3;
      }

      // draw trail
      for (let j = 0; j < trailLength; j++) {
        const text = columnChars[i][j];
        const yPos = (y - j) * fontSize + mouseY * blurOffset;

        const opacity = 1 - j / trailLength;

        ctx.fillStyle = `rgba(${color}, ${opacity * 0.2})`;
        ctx.fillText(text, x, yPos);

        if (Math.random() > 0.98) {
          columnChars[i][j] =
            letters[Math.floor(Math.random() * letters.length)];
        }
      }

      // reset column
      if (y * fontSize > canvas.height && Math.random() > 0.9) {
        drops[i] = 0;
        trailLengths[i] = Math.floor(Math.random() * 16) + 14;
      }
    });

    animationId = requestAnimationFrame(draw);
  }

  function start() {
    if (animationId) return;
    setup();
    draw();
  }

  function stop() {
    cancelAnimationFrame(animationId);
    animationId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return { start, stop, setup };
}

/* =========================
   CREATE LAYERS
========================= */

const backLayer = createMatrix("matrix-back", 0.06, 0.12, 0.3);
const midLayer = createMatrix("matrix-mid", 0.12, 0.1, 0.6);
const frontLayer = createMatrix("matrix-front", 0.2, 0.08, 1);

/* =========================
   RESIZE HANDLING
========================= */

window.addEventListener("resize", () => {
  if (contrastToggle) {
    backLayer.setup();
    midLayer.setup();
    frontLayer.setup();
  }
});

/* =========================
   TYPING EFFECT
========================= */

const text = ["Frontend Engineer", "React Developer", "UI Builder"];
let i = 0,
  j = 0,
  current = "",
  isDeleting = false;

function type() {
  const el = document.querySelector(".typing");

  if (!el) return;

  if (!isDeleting && j <= text[i].length) {
    current = text[i].substring(0, j++);
  } else if (isDeleting && j >= 0) {
    current = text[i].substring(0, j--);
  }

  el.innerHTML = current;

  if (j === text[i].length) isDeleting = true;
  if (j === 0) {
    isDeleting = false;
    i = (i + 1) % text.length;
  }

  setTimeout(type, isDeleting ? 75 : 100);
}

type();

// =========================
// CLOSE MENU WHEN CLICKING OUTSIDE
// =========================
document.addEventListener("click", (e) => {
  if (
    isMenuOpen &&
    !e.target.closest(".nav__link--list") &&
    !e.target.closest(".nav__menu-btn")
  ) {
    isMenuOpen = false;
    document.body.classList.remove("menu--open");
  }
});

// =========
// PARALLAX
// =========

function handleScroll() {
  const scrollY = window.scrollY;

  const landing = document.getElementById("landing-page");
  const projects = document.querySelector(".projects-section__wrapper");

  if (window.innerWidth > 1024) {
    if (landing) {
      const landingOffset = Math.min(scrollY * 0.5, 200);
      landing.style.backgroundPosition = `center ${-landingOffset}px`;
    }

    if (projects) {
      const projectOffset = Math.min(scrollY * 0.3, 150);
      projects.style.backgroundPosition = `center ${-projectOffset}px`;
    }
  }

  const triggerBottom = window.innerHeight * 0.85;

  document.querySelectorAll(".reveal").forEach((el) => {
    const top = el.getBoundingClientRect().top;

    if (top < triggerBottom) {
      el.classList.add("reveal--visible");
    } else {
      el.classList.remove("reveal--visible");
    }
  });
}

window.addEventListener("load", () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 0);
});

window.addEventListener("scroll", handleScroll);
handleScroll();

function scrollToProjects(e) {
  e.preventDefault();

  const projects = document.getElementById("projects");

  if (projects) {
    projects.scrollIntoView({
      behavior: "smooth",
    });
  }
}

// MOBILE PROJECT CARD TOGGLE
document.querySelectorAll(".project__info-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wrapper = btn.closest(".project__wrapper");
    const icon = btn.querySelector("i");

    const isActive = wrapper.classList.contains("active");

    document.querySelectorAll(".project__wrapper").forEach((w) => {
      w.classList.remove("active");
      const i = w.querySelector(".project__info-btn i");
      if (i) i.className = "fa-solid fa-info";
    });

    if (!isActive) {
      wrapper.classList.add("active");
      icon.className = "fa-solid fa-xmark";
    }
  });
});

// TAP OUTSIDE TO CLOSE
document.addEventListener("click", (e) => {
  if (!e.target.closest(".project__wrapper")) {
    document.querySelectorAll(".project__wrapper").forEach((w) => {
      w.classList.remove("active");

      const i = w.querySelector(".project__info-btn i");
      if (i) i.className = "fa-solid fa-info";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateThemeIcons();
});

// =============================
// CONTACT FORM (FORMSPREE AJAX)
// =============================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact__form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      console.log("FORM SUBMITTED"); // 👈 add this

      const loading = document.querySelector(".modal__overlay--loading");
      const success = document.querySelector(".modal__overlay--success");

      loading.classList.add("visible");

      const formData = new FormData(form);

      try {
        const response = await fetch("https://formspree.io/f/mojypypa", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        loading.classList.remove("visible");

        if (response.ok) {
          console.log("SUCCESS TRIGGERED"); // 👈 add this
          success.classList.add("visible");
          form.reset();
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        loading.classList.remove("visible");
        alert("Network error. Please try again.");
      }
    });
  }
});
