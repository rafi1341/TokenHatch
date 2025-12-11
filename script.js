document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Tab switching code ---
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

    // --- 2. PocketBase setup ---
    const pb = new PocketBase('http://127.0.0.1:8090'); // or your hosted URL
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "123456";
    let userRecord = null;

    // --- 3. Load tokens ---
    async function loadTokens() {
        try {
            userRecord = await pb.collection('users_tokens').getFirstListItem(`id="${userId}"`);
        } catch (err) {
            userRecord = await pb.collection('users_tokens').create({
                id: userId,
                tokens: 0,
                updated_at: new Date().toISOString()
            });
        }
        document.getElementById("token-count").textContent = userRecord.tokens;
    }
    loadTokens();

    // --- 4. Egg tap handler ---
    async function incrementToken() {
        userRecord.tokens++;
        document.getElementById("token-count").textContent = userRecord.tokens;

        await pb.collection('users_tokens').update(userRecord.id, {
            tokens: userRecord.tokens,
            updated_at: new Date().toISOString()
        });
    }

    document.getElementById("egg").addEventListener("click", async (e) => {
        // animation
        const egg = e.currentTarget;
        egg.classList.add("hit");
        setTimeout(() => egg.classList.remove("hit"), 100);

        // floating +1
        const plus = document.createElement("div");
        plus.classList.add("floating-plus");
        plus.textContent = "+1";
        plus.style.left = `${e.pageX}px`;
        plus.style.top = `${e.pageY}px`;
        document.body.appendChild(plus);
        setTimeout(() => plus.remove(), 800);

        // increment tokens
        await incrementToken();
    });
});
