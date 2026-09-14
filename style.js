// 1. Custom Smooth Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverTargets = document.querySelectorAll('.hover-target, a, button, .sticker');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = mouseX;
let outlineY = mouseY;
let cursorVisible = false;

window.addEventListener('mousemove', (e) => {
  // Pehle mouse move par hi cursor visible hoga taaki top-left me dot na dikhe
  if (!cursorVisible) {
    cursorDot.classList.add('cursor-active');
    cursorOutline.classList.add('cursor-active');
    cursorVisible = true;
  }

  mouseX = e.clientX;
  mouseY = e.clientY;

  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top = `${mouseY}px`;
});

function animateCursor() {
  outlineX += (mouseX - outlineX) * 0.15;
  outlineY += (mouseY - outlineY) * 0.15;

  cursorOutline.style.left = `${outlineX}px`;
  cursorOutline.style.top = `${outlineY}px`;

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor Hover Expand
hoverTargets.forEach((target) => {
  target.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-grow'));
  target.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-grow'));
});

// 2. Draggable Stickers Logic
const draggables = document.querySelectorAll('.drag-item');

draggables.forEach((item) => {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  item.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - item.getBoundingClientRect().left;
    offsetY = e.clientY - item.getBoundingClientRect().top;
    item.style.zIndex = 100;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    item.style.left = `${e.clientX - offsetX}px`;
    item.style.top = `${e.clientY - offsetY}px`;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
});

// 3. 3D Card Tilt on Mouse Move
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
});