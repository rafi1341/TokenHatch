document.addEventListener("DOMContentLoaded", () => {
    // --- Configuration ---
    const BOT_API = "https://telegrambot-or4r.onrender.com"; // Your bot URL (no trailing slash!)
    const API_SECRET = "383c5336-101c-4374-9cf9-44dd291db44c"; // ← CHANGE THIS!
    
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
    let pendingTokens = 0; // NEW: Tokens waiting to be sent to server
    let saveTimeout = null; // NEW: Timer for batching
    
    // Get Telegram user ID
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "test_user_123";
    console.log("User ID:", userId);
    
    // Fetch current balance from bot on load
    async function loadTokens() {
        console.log("🔄 Loading tokens for user:", userId);
        
        try {
            const res = await fetch(`${BOT_API}/get_balance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    user_id: userId,
                    api_secret: API_SECRET
                })
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            tokens = data.balance || 0;
            tokenCountDisplay.textContent = tokens;
            console.log("💰 Loaded tokens:", tokens);
        } catch (e) {
            console.error("❌ Failed to fetch tokens:", e);
            tokens = 0;
            tokenCountDisplay.textContent = tokens;
        }
    }
    
    loadTokens();
    
    // NEW: Send batched tokens to server
    async function sendBatchToServer(amount) {
        console.log("📤 Sending batch to server: +", amount, "tokens");
        
        try {
            const res = await fetch(`${BOT_API}/update_tokens`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    user_id: userId,
                    tokens: amount,
                    api_secret: API_SECRET
                })
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            console.log("✅ Server response:", data);
        } catch (e) {
            console.error("❌ Failed to send batch:", e);
        }
    }
    
    // Egg click handler - NOW WITH BATCHING!
    egg.addEventListener("click", (e) => {
        // Update local display immediately (instant feedback for user)
        tokens++;
        pendingTokens++; // NEW: Track tokens waiting to be sent
        tokenCountDisplay.textContent = tokens;
        
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
        
        // NEW: Batch API calls - send every 2 seconds
        clearTimeout(saveTimeout); // Reset timer on each tap
        saveTimeout = setTimeout(() => {
            if (pendingTokens > 0) {
                console.log(`📦 Batching ${pendingTokens} taps into ONE API call`);
                sendBatchToServer(pendingTokens);
                pendingTokens = 0;
            }
        }, 1000); // ⭐ 2-SECOND BATCHING - This is the key!
    });
    
    // NEW: Send any pending tokens when user closes the app
    window.addEventListener('beforeunload', () => {
        if (pendingTokens > 0) {
            // Use sendBeacon for reliability when page is closing
            const data = new Blob([JSON.stringify({
                user_id: userId,
                tokens: pendingTokens,
                api_secret: API_SECRET
            })], { type: 'application/json' });
            navigator.sendBeacon(`${BOT_API}/update_tokens`, data);
        }
    });
    
    // NEW: Send pending tokens when mini app loses focus
    window.addEventListener('blur', () => {
        if (pendingTokens > 0) {
            sendBatchToServer(pendingTokens);
            pendingTokens = 0;
            clearTimeout(saveTimeout);
        }
    });
});
