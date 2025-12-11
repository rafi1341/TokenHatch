document.addEventListener("DOMContentLoaded", () => {

    // --- Tab switching ---
    const tabBtns = document.querySelectorAll(".tab-btn");
    const screens = document.querySelectorAll(".screen");

    const tokenCountDisplay = document.getElementById("token-count");
    let tokens = await loadTokens(); // get initial value from Supabase
    tokenCountDisplay.textContent = tokens;

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

    // --- Egg tapping logic ---
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

        // Floating +1
        const plus = document.createElement("div");
        plus.classList.add("floating-plus");
        plus.textContent = "+1";
        plus.style.left = `${e.pageX}px`;
        plus.style.top = `${e.pageY}px`;
        document.body.appendChild(plus);

        setTimeout(() => plus.remove(), 800);
        saveTokens(tokens); 
    });

});
