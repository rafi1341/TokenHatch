// script.js
document.addEventListener("DOMContentLoaded", () => {
    // ------------------------
    // Tab switching
    // ------------------------
    const tabBtns = document.querySelectorAll(".tab-btn");
    const screens = document.querySelectorAll(".screen");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            screens.forEach(s => s.classList.add("hidden"));
            document.getElementById(btn.dataset.tab).classList.remove("hidden");

            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    // ------------------------
    // Egg tapping
    // ------------------------
    const egg = document.getElementById("egg");
    const tokenCountDisplay = document.getElementById("token-count");
    let tokens = parseInt(tokenCountDisplay.textContent) || 0;

    if (!egg) {
        console.error("Egg element not found!");
        return;
    }

    egg.addEventListener("click", () => {
        // Increment tokens locally
        tokens++;
        tokenCountDisplay.textContent = tokens;

        // Floating +1
        const plus = document.createElement("div");
        plus.classList.add("floating-plus");
        plus.textContent = "+1";
        plus.style.position = "absolute";
        plus.style.left = `${egg.getBoundingClientRect().left + egg.offsetWidth / 2}px`;
        plus.style.top = `${egg.getBoundingClientRect().top}px`;
        plus.style.color = "#fff";
        plus.style.fontWeight = "bold";
        plus.style.userSelect = "none";
        plus.style.pointerEvents = "none";
        plus.style.transition = "all 0.8s ease-out";
        document.body.appendChild(plus);

        setTimeout(() => {
            plus.style.transform = "translateY(-30px)";
            plus.style.opacity = "0";
        }, 0);

        setTimeout(() => plus.remove(), 800);

        // ------------------------
        // Send score to bot
        // ------------------------
        if (window.Telegram?.WebApp?.sendData) {
            window.Telegram.WebApp.sendData(JSON.stringify({ score: tokens }));
        }
    });
});
