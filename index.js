let isModalOpen = false;
let contrastToggle = false;

/* DARK MODE */
function toggleContrast() {
  contrastToggle = !contrastToggle;
  document.body.classList.toggle("dark-theme", contrastToggle);

  if (contrastToggle) {
    startMatrix();
  } else {
    stopMatrix();
  }
}

/* MODAL */
function toggleModal() {
  isModalOpen = !isModalOpen;
  document.body.classList.toggle("modal--open", isModalOpen);
}

/* EMAIL */
function contact(event) {
  event.preventDefault();

  const loading = document.querySelector('.modal__overlay--loading');
  const success = document.querySelector('.modal__overlay--success');

  loading.classList.add("modal__overlay--visible");

  emailjs.sendForm(
    'service_d0jhemc',
    'template_c9c74ob',
    event.target,
    'pzKixyN1PhnSzLVmX'
  ).then(() => {
    loading.classList.remove("modal__overlay--visible");
    success.classList.add("modal__overlay--visible");
  }).catch(() => {
    alert("Email failed. Contact directly.");
  });
}

/* MATRIX BACKGROUND */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

let animationId = null;

function setupMatrix() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const letters = "01";
const fontSize = 14;
let columns;
let drops;

function initDrops() {
  columns = canvas.width / fontSize;
  drops = Array(Math.floor(columns)).fill(1);
}

function drawMatrix() {
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f06449";
  ctx.font = fontSize + "px monospace";

  drops.forEach((y, i) => {
    const text = letters[Math.floor(Math.random() * letters.length)];
    const x = i * fontSize;

    ctx.fillText(text, x, y * fontSize);

    if (y * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  });

  animationId = requestAnimationFrame(drawMatrix);
}

/* START / STOP MATRIX */
function startMatrix() {
    if (animationId) return;
  setupMatrix();
  initDrops();
  drawMatrix();
}

function stopMatrix() {
  cancelAnimationFrame(animationId);
  animationId = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", () => {
  if (contrastToggle) {
    cancelAnimationFrame(animationId);
    setupMatrix();
    initDrops();
    drawMatrix();
  }
});

/* TYPING EFFECT */
const text = ["Frontend Engineer", "React Developer", "UI Builder"];
let i = 0, j = 0, current = "", isDeleting = false;

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