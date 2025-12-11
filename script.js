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

