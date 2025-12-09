// Telegram Mini App
const tg = window.Telegram.WebApp;
tg.expand();

// Button references
const startBtn = document.getElementById("start-btn");
const app = document.getElementById("app");
const navBtns = document.querySelectorAll(".nav-btn");
const screens = document.querySelectorAll(".screen");

// Launch the mini app
startBtn.addEventListener("click", () => {
    document.querySelector(".banner").classList.add("hidden");
    document.querySelector(".start-container").classList.add("hidden");
    app.classList.remove("hidden");
});

// Navigation switching
navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.tab;

        screens.forEach(screen => screen.classList.add("hidden"));
        document.getElementById(target + "-screen").classList.remove("hidden");

        navBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});
