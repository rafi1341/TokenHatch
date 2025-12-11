document.addEventListener("DOMContentLoaded", () => {
    const egg = document.getElementById("egg");
    const tokenCountDisplay = document.getElementById("token-count");

    if (!egg || !tokenCountDisplay) return;

    // --- Initialize PocketBase locally ---
    const pb = new PocketBase('http://127.0.0.1:8090'); // your local PB server
    const userId = "local_test_user"; // use a fixed ID for testing
    let tokens = 0;
    let userRecord;

    // --- Load or create user record ---
    async function loadUser() {
        try {
            userRecord = await pb.collection('users_tokens').getFirstListItem(`id="${userId}"`);
            tokens = userRecord.tokens;
        } catch (err) {
            // If no record exists, create it
            userRecord = await pb.collection('users_tokens').create({
                id: userId,
                tokens: 0
            });
            tokens = 0;
        }
        tokenCountDisplay.textContent = tokens;
    }

    loadUser();

    // --- Update PB ---
    async function updateTokens(newTokens) {
        tokens = newTokens;
        tokenCountDisplay.textContent = tokens;
        if (!userRecord) return;
        try {
            await pb.collection('users_tokens').update(userRecord.id, {
                tokens: tokens,
                updated_at: new Date().toISOString()
            });
        } catch (err) {
            console.error("Failed to update tokens:", err);
        }
    }

    // --- Egg click handler ---
    egg.addEventListener("click", (e) => {
        // Increment locally
        tokens++;
        tokenCountDisplay.textContent = tokens;

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
        document.body.appendChild(plus);
        setTimeout(() => plus.remove(), 800);

        // Async save to PB
        updateTokens(tokens);
    });
});
