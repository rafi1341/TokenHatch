// pb-integration.js
document.addEventListener("DOMContentLoaded", () => {
    // --- Initialize PocketBase ---
    let pb;
    try {
        pb = new PocketBase('http://127.0.0.1:8090'); // replace with your hosted PocketBase URL
    } catch(e) {
        console.error("PocketBase init failed:", e);
        return;
    }

    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "123456";
    let tokens = parseInt(document.getElementById("token-count")?.textContent || 0);
    let userRecord;

    // Load user record or create it
    async function loadUser() {
        try {
            userRecord = await pb.collection('users_tokens').getFirstListItem(`id="${userId}"`);
        } catch (err) {
            try {
                userRecord = await pb.collection('users_tokens').create({
                    id: userId,
                    tokens: tokens,
                    updated_at: new Date().toISOString()
                });
            } catch(e) {
                console.error("Failed to create user record:", e);
                return;
            }
        }
        // Sync local tokens with DB
        tokens = userRecord.tokens;
        const tokenCountDisplay = document.getElementById("token-count");
        if(tokenCountDisplay) tokenCountDisplay.textContent = tokens;
    }

    loadUser();

    // Update tokens in PocketBase asynchronously
    async function updateTokens(newTokens) {
        if(!userRecord) return;
        tokens = newTokens;
        try {
            await pb.collection('users_tokens').update(userRecord.id, {
                tokens: tokens,
                updated_at: new Date().toISOString()
            });
        } catch(e) {
            console.error("Failed to update tokens:", e);
        }
    }

    // Hook into egg click
    const egg = document.getElementById("egg");
    if(egg) {
        egg.addEventListener("click", () => {
            tokens++;
            document.getElementById("token-count").textContent = tokens;
            updateTokens(tokens); // async, won’t block animation
        });
    }
});
