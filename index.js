let isModalOpen = false;
let contrastToggle = false;

/* =========================
   DARK MODE
========================= */
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
}

/* =========================
   MODAL
========================= */
function toggleModal() {
  isModalOpen = !isModalOpen;
  document.body.classList.toggle("modal--open", isModalOpen);
}

/* =========================
   EMAIL
========================= */
function contact(event) {
  event.preventDefault();

  const loading = document.querySelector(".modal__overlay--loading");
  const success = document.querySelector(".modal__overlay--success");

  loading.classList.add("modal__overlay--visible");

  emailjs
    .sendForm(
      "service_d0jhemc",
      "template_c9c74ob",
      event.target,
      "pzKixyN1PhnSzLVmX",
    )
    .then(() => {
      loading.classList.remove("modal__overlay--visible");
      success.classList.add("modal__overlay--visible");
    })
    .catch(() => {
      alert("Email failed. Contact directly.");
    });
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
        drops[i] += speedMultiplier * 0.1;
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
const midLayer = createMatrix("matrix-mid", 0.12, 0.10, 0.6);
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
