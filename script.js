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

    // --- Egg tapping & token logic ---
    const egg = document.getElementById("egg");
    const tokenCountDisplay = document.getElementById("token-count");
    let tokens = 0;

    const BOT_API = "http://127.0.0.1:5000"; // your bot API URL
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "123456";

    // Fetch tokens on load
    async function loadTokens() {
        try {
            const res = await fetch(`${BOT_API}/get_tokens?user_id=${userId}`);
            const data = await res.json();
            tokens = data.tokens || 0;
            tokenCountDisplay.textContent = tokens;
        } catch (e) {
            console.error("Failed to fetch tokens:", e);
        }
    }

    loadTokens();

    // Update tokens on bot
    async function updateTokens() {
        try {
            await fetch(`${BOT_API}/update_tokens`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, tokens })
            });
        } catch (e) {
            console.error("Failed to update tokens:", e);
        }
    }

    // Egg click handler
    egg.addEventListener("click", (e) => {
        tokens++;
        tokenCountDisplay.textContent = tokens;
        updateTokens(); // async, doesn’t block animation

        // Hit animation
        egg.classList.add("hit");
        setTimeout(() => egg.classList.remove("hit"), 100);

        // Floating +1
        const plus = document.createElement("div");
        plus.classList.add("floating-plus");
        plus.textContent = "+1";
        plus.style.position = "absolute";
        plus.style.left = `${e.pageX}px`;
        plus.style.top = `${e.pageY}px`;
        plus.style.color = "#fff";
        plus.style.fontWeight = "bold";
        plus.style.userSelect = "none";
        document.body.appendChild(plus);

        setTimeout(() => plus.remove(), 800);
    });
});
