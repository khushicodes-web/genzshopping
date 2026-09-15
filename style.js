// 1. Initialize Icons
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  startCountdown();
});

// 2. Cart Functionality
let cartCount = 0;

function addToCart(productName) {
  cartCount++;
  const badge = document.getElementById("cartCount");
  if (badge) {
    badge.innerText = cartCount;

    // Pulse animation
    badge.style.transform = "scale(1.4)";
    setTimeout(() => {
      badge.style.transform = "scale(1)";
    }, 180);
  }

  // Visual confirmation toast
  showToast(`Added "${productName}" to bag!`);
}

function openCart() {
  if (cartCount === 0) {
    alert("Your bag is empty. Check out the 3 AM drop!");
  } else {
    alert(`You have ${cartCount} item(s) in your bag. Proceeding to checkout.`);
  }
}

function showToast(msg) {
  let toast = document.createElement("div");
  toast.innerText = msg;
  toast.style.position = "fixed";
  toast.style.bottom = "24px";
  toast.style.right = "24px";
  toast.style.background = "#000";
  toast.style.color = "#fff";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "999px";
  toast.style.fontSize = "13px";
  toast.style.fontWeight = "700";
  toast.style.zIndex = "9999";
  toast.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2200);
}

// 3. Drop Countdown Timer
function startCountdown() {
  let totalSeconds = 9 * 3600 + 42 * 60 + 18; // 09:42:18 initial

  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  setInterval(() => {
    if (totalSeconds <= 0) return;
    totalSeconds--;

    let hrs = Math.floor(totalSeconds / 3600);
    let mins = Math.floor((totalSeconds % 3600) / 60);
    let secs = totalSeconds % 60;

    if (hoursEl) hoursEl.innerText = hrs.toString().padStart(2, "0");
    if (minutesEl) minutesEl.innerText = mins.toString().padStart(2, "0");
    if (secondsEl) secondsEl.innerText = secs.toString().padStart(2, "0");
  }, 1000);
}

// 4. Filter Tabs Logic
const tabs = document.querySelectorAll(".pill-tab");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});
