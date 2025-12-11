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

    // --- Egg logic ---
    function initEgg() {
        const egg = document.getElementById("egg");
        const tokenCountDisplay = document.getElementById("token-count");
        let tokens = 0;

        if(!egg) {
            console.error("Egg element not found!");
            return;
        }

        egg.addEventListener("click", (e) => {
            tokens++;
            tokenCountDisplay.textContent = tokens;

            // Hit animation
            egg.classList.add("hit");
            setTimeout(() => egg.classList.remove("hit"), 100);

            // Floating +1
            const plus = document.createElement("div");
            plus.classList.add("floating-plus");
            plus.textContent = "+1";
            plus.style.left = `${e.pageX}px`;
            plus.style.top = `${e.pageY}px`;
            document.body.appendChild(plus);
            setTimeout(() => plus.remove(), 800);
        });
    }

    initEgg(); // call after DOM is ready
});
