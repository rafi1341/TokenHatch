// script.js
document.addEventListener("DOMContentLoaded", () => {

    // --- Tabs ---
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

    // --- Egg tapping ---
    const egg = document.getElementById("egg");
    const tokenCountDisplay = document.getElementById("token-count");
    let tokens = parseInt(tokenCountDisplay.textContent) || 0;

    async function loadUser() {
        try {
            userRecord = await pb.collection('users_tokens').getFirstListItem(`id="${userId}"`);
        } catch {
            userRecord = await pb.collection('users_tokens').create({
                id: userId,
                tokens: tokens,
                updated_at: new Date().toISOString()
            });
        }
        tokens = userRecord.tokens;
        tokenCountDisplay.textContent = tokens;
    }

    loadUser();

    async function updateTokens() {
        if(!userRecord) return;
        tokens++;
        tokenCountDisplay.textContent = tokens;
        try {
            await pb.collection('users_tokens').update(userRecord.id, {
                tokens: tokens,
                updated_at: new Date().toISOString()
            });
        } catch(e) {
            console.error("Failed to update tokens:", e);
        }
    }

    // Click handler
    egg.addEventListener("click", async (e) => {
        // Animate +1
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

        // Hit animation
        egg.classList.add("hit");
        setTimeout(() => egg.classList.remove("hit"), 100);

        // Update tokens
        await updateTokens();
    });
});
