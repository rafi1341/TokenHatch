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
    let tokens = 0;

    // --- PocketBase setup ---
    let pb, userRecord;
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "123456";

    try {
        pb = new PocketBase('http://127.0.0.1:8090'); // replace with your hosted URL
    } catch(e) {
        console.error("PocketBase init failed:", e);
    }

    // Load user tokens (async, non-blocking)
    async function loadTokens() {
        if(!pb) return;
        try {
            userRecord = await pb.collection('users_tokens').getFirstListItem(`id="${userId}"`);
        } catch (err) {
            try {
                userRecord = await pb.collection('users_tokens').create({
                    id: userId,
                    tokens: 0,
                    updated_at: new Date().toISOString()
                });
            } catch(e) {
                console.error("Failed to create user record:", e);
                return;
            }
        }
        tokens = userRecord.tokens;
        tokenCountDisplay.textContent = tokens;
    }
    loadTokens();

    async function updateTokensInDB() {
        if(!pb || !userRecord) return;
        try {
            await pb.collection('users_tokens').update(userRecord.id, {
                tokens: tokens,
                updated_at: new Date().toISOString()
            });
        } catch(e) {
            console.error("Failed to update tokens:", e);
        }
    }

    // --- Egg click handler ---
    egg.addEventListener("click", (e) => {
        // Update tokens locally immediately
        tokens++;
        tokenCountDisplay.textContent = tokens;

        // Animation
        egg.classList.add("hit");
        setTimeout(() => egg.classList.remove("hit"), 100);

        const plus = document.createElement("div");
        plus.classList.add("floating-plus");
        plus.textContent = "+1";
        plus.style.left = `${e.pageX}px`;
        plus.style.top = `${e.pageY}px`;
        document.body.appendChild(plus);
        setTimeout(() => plus.remove(), 800);

        // Save to PocketBase asynchronously, does not block click
        updateTokensInDB();
    });

});
