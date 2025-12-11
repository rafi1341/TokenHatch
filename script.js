const tabBtns = document.querySelectorAll(".tab-btn");
const screens = document.querySelectorAll(".screen");

tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.tab;

        screens.forEach(s => s.classList.add("hidden"));
        document.getElementById(target).classList.remove("hidden");

        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

// Egg tapping logic
const egg = document.getElementById("egg");
const hitCountDisplay = document.getElementById("hit-count");

let hits = 0;

egg.addEventListener("click", () => {
    hits++;
    
    // Add hit animation
    egg.classList.add("hit");
    setTimeout(() => {
        egg.classList.remove("hit");
    }, 100);

    // Update hit count
    hitCountDisplay.textContent = `Hits: ${hits}`;
});

const egg = document.getElementById("egg");
const tokenCountDisplay = document.getElementById("token-count");

let tokens = 0;

egg.addEventListener("click", (e) => {
    // Increment token
    tokens++;
    tokenCountDisplay.textContent = tokens;

    // Hit animation
    egg.classList.add("hit");
    setTimeout(() => egg.classList.remove("hit"), 100);

    // Create floating +1
    const plus = document.createElement("div");
    plus.classList.add("floating-plus");
    plus.textContent = "+1";

    // Position it where user clicked
    const rect = egg.getBoundingClientRect();
    plus.style.left = `${e.clientX - rect.left}px`;
    plus.style.top = `${e.clientY - rect.top}px`;

    // Add to egg-wrapper
    const wrapper = document.querySelector(".egg-wrapper");
    wrapper.appendChild(plus);

    // Remove after animation
    setTimeout(() => {
        plus.remove();
    }, 800);
});


