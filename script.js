const startBtn = document.getElementById("start-btn");
const tabs = document.querySelector(".tabs");
const tabBtns = document.querySelectorAll(".tab-btn");
const screens = document.querySelectorAll(".screen");

// Launch app
startBtn.addEventListener("click", () => {
    document.querySelector(".banner").classList.add("hidden");
    document.querySelector(".start-container").classList.add("hidden");
    tabs.classList.remove("hidden");
    document.getElementById("home").classList.remove("hidden"); // Show default screen
});

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.tab;

        // Hide all screens
        screens.forEach(screen => screen.classList.add("hidden"));
        // Show clicked screen
        document.getElementById(target).classList.remove("hidden");

        // Active button styling
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});
