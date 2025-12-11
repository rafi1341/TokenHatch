document.addEventListener("DOMContentLoaded", () => {
    // --- Tab switching ---
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

    // --- Egg tapping logic ---
    const egg = document.getElementById("egg");
    const tokenCountDisplay = document.getElementById("token-count");

    // Load tokens from LocalStorage or start with 0
    let tokens = parseInt(localStorage.getItem('eggTokens') || 0);
    tokenCountDisplay.textContent = tokens;

    if (!egg) {
        console.error("Egg element not found!");
        return;
    }

    egg.addEventListener("click", (e) => {
        // Increment token
        tokens++;
        tokenCountDisplay.textContent = tokens;

        // Save to LocalStorage
        localStorage.setItem('eggTokens', tokens);

        // Hit animation
        egg.classList.add("hit");
        setTimeout(() => egg.classList.remove("hit"), 100);

        // Floating +1 animation
        const plus = document.createElement("div");
        plus.classList.add("floating-plus");
        plus.textContent = "+1";
        plus.style.position = "absolute";
        plus.style.left = `${e.pageX}px`;
        plus.style.top = `${e.pageY}px`;
        plus.style.color = "#fff";
        plus.style.fontWeight = "bold";
        plus.style.userSelect = "none";
        plus.style.pointerEvents = "none";
        plus.style.transition = "all 0.8s ease-out";
        document.body.appendChild(plus);

        // Animate upwards
        setTimeout(() => {
            plus.style.top = `${e.pageY - 30}px`;
            plus.style.opacity = '0';
        }, 10);

        // Remove element after animation
        setTimeout(() => plus.remove(), 800);
    });
});
