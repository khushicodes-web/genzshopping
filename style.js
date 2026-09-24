// 1. Initialize Icons & Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  startCountdown();
  startDropLiveTimer();
  initHotspots();
  initFilters();
  initBundleButton();
  initOutsideClickListener();
  initSalesPopup(); // Dynamic Sales Toast Tracker
});

// 2. Cart Functionality
let cartCount = 0;

function updateBadge() {
  const badge = document.getElementById("cartCount");
  const dockBadge = document.getElementById("dockCartCount");

  if (badge) {
    badge.innerText = cartCount;

    // Pulse animation
    badge.style.transform = "scale(1.4)";
    setTimeout(() => {
      badge.style.transform = "scale(1)";
    }, 180);
  }

  if (dockBadge) {
    dockBadge.innerText = cartCount;
  }
}

function addToCart(productName) {
  cartCount++;
  updateBadge();

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
  toast.style.bottom = "84px";
  toast.style.right = "24px";
  toast.style.background = "#09090b";
  toast.style.color = "#acf847";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "999px";
  toast.style.fontSize = "13px";
  toast.style.fontWeight = "700";
  toast.style.fontFamily = "'Space Grotesk', monospace";
  toast.style.letterSpacing = "0.04em";
  toast.style.zIndex = "99999";
  toast.style.border = "1px solid rgba(255, 255, 255, 0.15)";
  toast.style.boxShadow = "0 12px 28px rgba(0,0,0,0.4)";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2200);
}

// 3. Drop Countdown Timer (Bottom Strip)
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

// 4. Hero Top Pill Timer (02D : 14H : 32M)
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

// 5. Lookbook Hotspot Click Handlers
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

// 6. Filter Tabs Logic (Active state change + Card hide/show)
function initFilters() {
  const tabs = document.querySelectorAll(".pill-tab");
  const productCards = document.querySelectorAll(".product-card");

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

// 7. Get The Look Bundle Button
function initBundleButton() {
  const bundleBtn = document.getElementById("addBundle") || document.querySelector(".bundle-btn");

  if (bundleBtn) {
    bundleBtn.addEventListener("click", () => {
      cartCount += 2; // Bomber + Denim bundle count
      updateBadge();
      showToast('Added "Night Spiral Bundle" (-15% OFF) to bag!');
    });
  }
}

// 8. Size Tray Toggle on Click
function toggleSizeTray(cardElement) {
  const allCards = document.querySelectorAll(".product-card");
  allCards.forEach((c) => {
    if (c !== cardElement) c.classList.remove("tray-active");
  });
  cardElement.classList.toggle("tray-active");
}

// 9. Close Active Trays When Clicking Outside
function initOutsideClickListener() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".product-card")) {
      document.querySelectorAll(".product-card").forEach((c) => {
        c.classList.remove("tray-active");
      });
    }
  });
}

// 10. Real-time Sales Toast Popup
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
