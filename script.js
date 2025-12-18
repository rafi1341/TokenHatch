document.addEventListener("DOMContentLoaded", () => {

    // --- Configuration ---
    const BOT_API = "https://telegrambot-or4r.onrender.com"; // Your bot URL (no trailing slash!)
    const API_SECRET = "383c5336-101c-4374-9cf9-44dd291db44c"; // ← CHANGE THIS!
    
 // --- Tokens ---
    const balanceDisplay = document.getElementById("hatch-balance");
    let tokens = parseInt(localStorage.getItem("tokens")) || 12450; // start from previous value
    balanceDisplay.textContent = tokens.toLocaleString();

    // --- Current Egg ---
    let currentEgg = {
        name: "Dragon Egg",
        emoji: "🥚",
        creature: "🐉",
        creatureName: "Dragon",
        currentHP: 4500,
        requiredHP: 10000,
        hpPerTap: 10
    };

    // --- DOM Elements ---
    const eggEmoji = document.getElementById("main-egg");
    const eggNameEl = document.getElementById("egg-name");
    const unlockStatusEl = document.getElementById("unlock-status");
    const progressBar = document.getElementById("progress-bar");
    const progressPercentage = document.getElementById("progress-percentage");
    const currentHPEl = document.getElementById("current-hp");
    const requiredHPEl = document.getElementById("required-hp");

    // --- Update progress bar ---
    function updateProgress() {
        const pct = Math.min((currentEgg.currentHP / currentEgg.requiredHP) * 100, 100);
        progressBar.style.width = pct + "%";
        progressPercentage.textContent = Math.floor(pct) + "%";
        currentHPEl.textContent = currentEgg.currentHP.toLocaleString();
        requiredHPEl.textContent = currentEgg.requiredHP.toLocaleString();
    }

    updateProgress();

    // --- Floating text ---
    function showFloatingText(text, x, y) {
        const floatText = document.createElement("div");
        floatText.className = "float-text";
        floatText.textContent = text;
        floatText.style.left = x + "px";
        floatText.style.top = y + "px";
        document.body.appendChild(floatText);
        setTimeout(() => floatText.remove(), 1000);
    }

    // --- Tap Egg ---
    function tapEgg(e) {
        // Increase HP
        currentEgg.currentHP += currentEgg.hpPerTap;

        // Increase tokens
        tokens += currentEgg.hpPerTap;
        balanceDisplay.textContent = tokens.toLocaleString();
        localStorage.setItem("tokens", tokens);

        // Floating +text
        showFloatingText("+" + currentEgg.hpPerTap, e.clientX, e.clientY);

        // Egg shake animation
        eggEmoji.style.transform = "scale(0.9) rotate(-5deg)";
        setTimeout(() => {
            eggEmoji.style.transform = "scale(1) rotate(0deg)";
        }, 100);

        // Update progress bar
        updateProgress();

        // Check for hatch
        if (currentEgg.currentHP >= currentEgg.requiredHP) {
            hatchEgg();
        }
    }

    eggEmoji.addEventListener("click", tapEgg);

    // --- Hatch Egg ---
    function hatchEgg() {
        eggEmoji.textContent = currentEgg.creature;
        showFloatingText("🎉 " + currentEgg.creatureName + " HATCHED! 🎉", window.innerWidth / 2, window.innerHeight / 2);

        setTimeout(() => {
            alert(`🎉 Congratulations!\n\n${currentEgg.creatureName} has hatched!`);
            // Reset for next egg (example, you can load from backend)
            currentEgg = {
                name: "Eagle Egg",
                emoji: "🥚",
                creature: "🦅",
                creatureName: "Eagle",
                currentHP: 0,
                requiredHP: 15000,
                hpPerTap: 10
            };
            eggEmoji.textContent = currentEgg.emoji;
            eggNameEl.textContent = currentEgg.emoji + " " + currentEgg.name;
            unlockStatusEl.textContent = "Tap to unlock " + currentEgg.creatureName + "!";
            updateProgress();
        }, 1500);
    }

    // --- Passive income simulation ---
    const collectedAmountEl = document.getElementById("collected-amount");
    let passiveIncome = 250; // $HATCH per interval
    setInterval(() => {
        let collected = parseInt(collectedAmountEl.textContent) || 0;
        collected += 2; // small increment
        collectedAmountEl.textContent = collected;
    }, 3000);

    // --- Collect income ---
    window.collectIncome = function (event) {
        const amount = parseInt(collectedAmountEl.textContent);
        tokens += amount;
        balanceDisplay.textContent = tokens.toLocaleString();
        localStorage.setItem("tokens", tokens);

        showFloatingText("+" + amount + " $HATCH", event.clientX, event.clientY);

        collectedAmountEl.textContent = "0";

        const btn = event.target;
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Collected! ✅";
        btn.style.background = "#00d68f";

        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        }, 2000);
    };

});
