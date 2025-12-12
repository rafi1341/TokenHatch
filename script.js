document.addEventListener("DOMContentLoaded", () => {
    // --- Configuration ---
    const BOT_API = "https://telegrambot-or4r.onrender.com"; // ← CHANGE THIS to your actual Render URL
    const API_SECRET = "383c5336-101c-4374-9cf9-44dd291db44c"; // ← CHANGE THIS to your actual API_SECRET
    
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
    
    // Get Telegram user ID
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "test_user_123";
    console.log("User ID:", userId);
    
    // Fetch current balance from bot on load
    async function loadTokens() {
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
            console.log("Loaded tokens:", tokens);
        } catch (e) {
            console.error("Failed to fetch tokens:", e);
            // If loading fails, start at 0
            tokens = 0;
            tokenCountDisplay.textContent = tokens;
        }
    }
    
    loadTokens();
    
    // Update tokens on bot (add increment, not total)
    async function addTokenToServer(amount) {
        try {
            const res = await fetch(`${BOT_API}/update_tokens`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    user_id: userId,
                    tokens: amount, // Amount to ADD (e.g., 1)
                    api_secret: API_SECRET
                })
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            console.log("Server response:", data);
        } catch (e) {
            console.error("Failed to update tokens:", e);
        }
    }
    
    // Egg click handler
    egg.addEventListener("click", (e) => {
        // Update local display immediately
        tokens++;
        tokenCountDisplay.textContent = tokens;
        
        // Send +1 to server (async, doesn't block animation)
        addTokenToServer(1);
        
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
