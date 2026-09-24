// ==========================================
// 1. Initialize Icons & Main Event Listeners
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Render Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Timers & Dynamic Elements Setup
  startCountdown();
  startDropLiveTimer();
  initHotspots();
  initFilters();
  initBundleButton();
  initOutsideClickListener();
  initSalesPopup();

  // Attach Wishlist, Cart & Theme Handlers
  initWishlistButtons();
  initAddToCartButtons();
  initThemeToggle();
});

// ==========================================
// 2. Global State Variables
// ==========================================
let cartCount = 0;
let wishlistCount = 0;
let wishlistedItems = new Set();

// ==========================================
// 3. Cart Functionality & Badges
// ==========================================
function updateBadge() {
  const badge = document.getElementById("cartCount");
  const dockBadge = document.getElementById("dockCartCount");

  if (badge) {
    badge.innerText = cartCount;
    badge.style.transform = "scale(1.4)";
    setTimeout(() => {
      badge.style.transform = "scale(1)";
    }, 180);
  }

  if (dockBadge) {
    dockBadge.innerText = cartCount;
  }
}

// Global function to attach directly or call from HTML inline onclick
function addToCart(productName) {
  cartCount++;
  updateBadge();
  showToast(`Added "${productName}" to bag!`);
}

// Dynamic Binding for 'ADD TO BAG' and Mini-Cart Buttons
function initAddToCartButtons() {
  const addBtns = document.querySelectorAll(".add-to-bag-btn, .mini-cart-btn, [data-action='add-to-cart']");

  addBtns.forEach((btn) => {
    // Sirf un buttons par event lagayenge jinpar inline onclick HTML me na ho
    if (!btn.getAttribute("onclick")) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = btn.closest(".product-card, .product-item");
        const title = card?.querySelector(".product-title, .product-title-link")?.innerText.trim() || "Item";
        addToCart(title);
      });
    }
  });
}

function openCart() {
  if (cartCount === 0) {
    showToast("Your bag is empty. Check out the 3 AM drop!");
  } else {
    alert(`You have ${cartCount} item(s) in your bag. Proceeding to checkout.`);
  }
}

// Toast Popup Alert System
function showToast(msg) {
  let toast = document.createElement("div");
  toast.innerText = msg;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "84px",
    right: "24px",
    background: "#09090b",
    color: "#acf847",
    padding: "12px 24px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    fontFamily: "'Space Grotesk', monospace",
    letterSpacing: "0.04em",
    zIndex: "99999",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.4)"
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2200);
}

// ==========================================
// 4. Wishlist Interactive Logic
// ==========================================
function initWishlistButtons() {
  // Targets classes used in HTML for heart icons
  const wishlistBtns = document.querySelectorAll(".wishlist-btn, .wishlist-btn-round, .heart-icon");

  wishlistBtns.forEach((btn) => {
    if (!btn.getAttribute("onclick")) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = btn.closest(".product-card, .product-item");
        const title = card?.querySelector(".product-title, .product-title-link")?.innerText.trim() || "Selected Product";
        toggleWishlist(btn, title);
      });
    }
  });

  // Header Wishlist Icon Click Trigger
  const topWishlistIcon = document.getElementById("wishlistTrigger") || document.querySelector(".top-wishlist-icon");
  if (topWishlistIcon && !topWishlistIcon.getAttribute("onclick")) {
    topWishlistIcon.addEventListener("click", toggleWishlistModal);
  }
}

function toggleWishlist(btnElement, productName) {
  const svg = btnElement.querySelector("svg") || btnElement;
  const path = btnElement.querySelector("path");

  if (wishlistedItems.has(productName)) {
    wishlistedItems.delete(productName);
    wishlistCount--;
    btnElement.classList.remove("active-wishlist");

    // Clear SVG Red Fill back to line outline
    if (path) path.style.fill = "none";
    if (svg) svg.style.stroke = "#111";

    showToast(`Removed "${productName}" from wishlist`);
  } else {
    wishlistedItems.add(productName);
    wishlistCount++;
    btnElement.classList.add("active-wishlist");

    // Apply Red Fill to SVG Path on wishlist click
    if (path) path.style.fill = "#ff4757";
    if (svg) svg.style.stroke = "#ff4757";

    showToast(`Saved "${productName}" to wishlist ❤️`);
  }

  updateWishlistBadge();
}

function updateWishlistBadge() {
  const badges = document.querySelectorAll("#wishlistCount, .wishlist-count-badge");
  badges.forEach((badge) => {
    badge.innerText = wishlistCount;
    badge.style.transform = "scale(1.4)";
    setTimeout(() => {
      badge.style.transform = "scale(1)";
    }, 180);
  });
}

function toggleWishlistModal() {
  if (wishlistCount === 0) {
    showToast("Your wishlist is empty!");
  } else {
    alert(`Your Wishlist (${wishlistCount} items):\n\n` + Array.from(wishlistedItems).join("\n"));
  }
}

// ==========================================
// 5. Timers & Countdown Systems
// ==========================================
function startCountdown() {
  let totalSeconds = 9 * 3600 + 42 * 60 + 18;

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

function startDropLiveTimer() {
  const timerBadge = document.querySelector(".badge-timer");
  if (!timerBadge) return;

  let totalSeconds = 2 * 86400 + 14 * 3600 + 32 * 60;

  setInterval(() => {
    if (totalSeconds <= 0) return;
    totalSeconds--;

    let days = Math.floor(totalSeconds / 86400);
    let hrs = Math.floor((totalSeconds % 86400) / 3600);
    let mins = Math.floor((totalSeconds % 3600) / 60);

    timerBadge.innerText = `${days.toString().padStart(2, "0")}D : ${hrs.toString().padStart(2, "0")}H : ${mins.toString().padStart(2, "0")}M`;
  }, 1000);
}

// ==========================================
// 6. Lookbook Hotspots Handler
// ==========================================
function initHotspots() {
  const hotspots = document.querySelectorAll(".hotspot, .hotspot-pin");
  hotspots.forEach((spot) => {
    spot.addEventListener("click", (e) => {
      e.stopPropagation();
      const itemTitle = spot.getAttribute("title") || spot.querySelector("strong")?.innerText || "Selected Item";
      showToast(`Selected: ${itemTitle}`);
    });
  });
}

// ==========================================
// 7. Filter Tabs Logic
// ==========================================
function initFilters() {
  const tabs = document.querySelectorAll(".pill-tab");
  const productCards = document.querySelectorAll(".product-card, .product-item");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filterCategory = (tab.getAttribute("data-filter") || tab.innerText).trim().toLowerCase();

      productCards.forEach((card) => {
        const cardCategory = (card.getAttribute("data-category") || "").toLowerCase();

        if (filterCategory === "all" || cardCategory.includes(filterCategory)) {
          card.style.display = "";
          card.style.opacity = "1";
        } else {
          card.style.display = "none";
          card.style.opacity = "0";
        }
      });
    });
  });
}

// ==========================================
// 8. Bundle Button Handler
// ==========================================
function initBundleButton() {
  const bundleBtn = document.getElementById("addBundle") || document.querySelector(".bundle-btn");

  if (bundleBtn) {
    bundleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      cartCount += 2;
      updateBadge();
      showToast('Added "Night Spiral Bundle" (-15% OFF) to bag!');
    });
  }
}

// ==========================================
// 9. Size Tray Mechanics
// ==========================================
function toggleSizeTray(cardElement) {
  const allCards = document.querySelectorAll(".product-card");
  allCards.forEach((c) => {
    if (c !== cardElement) c.classList.remove("tray-active");
  });
  cardElement.classList.toggle("tray-active");
}

function initOutsideClickListener() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".product-card")) {
      document.querySelectorAll(".product-card").forEach((c) => {
        c.classList.remove("tray-active");
      });
    }
  });
}

// ==========================================
// 10. Real-time Sales Toast Popup
// ==========================================
function initSalesPopup() {
  const salesData = [
    { name: "Aarav from Delhi", item: "Acid Washed Hoodie", time: "2m ago" },
    { name: "Ananya from Mumbai", item: "Cyber Platform Sneakers", time: "4m ago" },
    { name: "Rohan from Bangalore", item: "Distressed Denim Bomber", time: "1m ago" }
  ];

  const toast = document.createElement("div");
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    left: "24px",
    background: "#09090b",
    color: "#ffffff",
    padding: "10px 18px",
    borderRadius: "14px",
    fontSize: "12px",
    fontFamily: "'Space Grotesk', monospace",
    zIndex: "9999",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    opacity: "0",
    transform: "translateY(20px)",
    transition: "all 0.4s ease",
    pointerEvents: "none"
  });

  document.body.appendChild(toast);

  let index = 0;
  setInterval(() => {
    const data = salesData[index];
    toast.innerHTML = `
      <span style="background:#acf847; width:8px; height:8px; border-radius:50%; display:inline-block; flex-shrink:0;"></span>
      <div>
        <strong>${data.name}</strong> bought <span style="color:#acf847">${data.item}</span>
        <div style="font-size:10px; color:#888;">${data.time}</div>
      </div>
    `;

    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
    }, 4000);

    index = (index + 1) % salesData.length;
  }, 9000);
}

// ==========================================
// 11. Theme Switcher Toggle
// ==========================================
function initThemeToggle() {
  const themeSwitch = document.querySelector(".theme-switch, .toggle-switch");
  if (themeSwitch) {
    themeSwitch.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      showToast("Theme Toggled");
    });
  }
}
