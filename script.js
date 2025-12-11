document.addEventListener("DOMContentLoaded", () => {

    // --- Tab switching code ---
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

    // --- PocketBase setup ---
    const pb = new PocketBase('http://127.0.0.1:8090'); // replace with your hosted URL if needed
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "123456";
    let userRecord = null;

    // --- Load tokens from PocketBase ---
    async function loadTokens() {
        try {
            userRecord = await pb.collection('users_tokens').getFirstListItem(`id="${userId}"`);
        } catch (err) {
            // create record if not exists
            userRecord = await pb.collection('users_tokens').create({
                id: userId,
                tokens: 0,
                updated_at: new Date().toISOString()
            });
        }
        document.getElementById("token-count").textContent = userRecord.tokens;
    }
    loadTokens();

    // --- Increment tokens on egg click ---
    async function incrementToken() {
        userRecord.tokens++;
        document.getElementById("token-count").textContent = userRecord.tokens;

        await pb.collection('users_tokens').update(userRecord.id, {
            tokens: userRecord.tokens,
            updated_at: new Date().toISOString()
        });
    }

    const egg = document.getElementById("egg");
    egg.addEventListener("click", async (e) => {
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

        // Increment tokens
        await incrementToken();
    });

});
