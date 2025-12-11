document.addEventListener("DOMContentLoaded", () => {

    // --- Tab switching (works independently) ---
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

    // --- Egg tapping logic (works independently) ---
    const egg = document.getElementById("egg");
    const tokenCountDisplay = document.getElementById("token-count");
    let tokens = 0;

    egg.addEventListener("click", (e) => {
        tokens++;
        tokenCountDisplay.textContent = tokens;

        const plus = document.createElement("div");
        plus.classList.add("floating-plus");
        plus.textContent = "+1";
        plus.style.left = `${e.pageX}px`;
        plus.style.top = `${e.pageY}px`;
        document.body.appendChild(plus);
        setTimeout(() => plus.remove(), 800);

        // Save to Supabase asynchronously, non-blocking
        saveTokens(tokens);
    });

});
