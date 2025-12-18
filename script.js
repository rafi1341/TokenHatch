document.addEventListener("DOMContentLoaded", () => {

    // --- Configuration ---
    const BOT_API = "https://telegrambot-or4r.onrender.com"; // Your bot URL (no trailing slash!)
    const API_SECRET = "383c5336-101c-4374-9cf9-44dd291db44c"; // ← CHANGE THIS!
    
    // --- Tokens ---
    const tokenCountDisplay = document.getElementById("token-count");
    let tokens = 0;

    // --- Egg Data ---
    const eggs = [
        {
            name: "Chick Egg",
            description: "A warm shell with tiny heartbeats inside.",
            eggImage: "assets/eggs/egg_chick.png",
            creatureName: "Chick",
            creatureDescription: "Small, fast, and eager to grow.",
            maxHP: 10
        }
    ];

    let currentEggHP = eggs[0].maxHP;

    // --- DOM Elements ---
    const egg = document.getElementById("egg");
    const eggName = document.getElementById("egg-name");
    const eggDesc = document.getElementById("egg-desc");
    const eggHP = document.getElementById("egg-hp");

    function loadEgg() {
        const e = eggs[0];
        egg.src = e.eggImage;
        eggName.textContent = e.name;
        eggDesc.textContent = e.description;
        eggHP.textContent = `HP: ${currentEggHP}/${e.maxHP}`;
    }

    loadEgg();

    // --- Egg click ---
    egg.addEventListener("click", (e) => {
        // Increase tokens
        tokens++;
        tokenCountDisplay.textContent = tokens;

        // Egg HP decrease
        currentEggHP--;
        eggHP.textContent = `HP: ${currentEggHP}/${eggs[0].maxHP}`;

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

        // Check for hatch
        if (currentEggHP <= 0) {
            alert(`🎉 ${eggs[0].creatureName} hatched!\n${eggs[0].creatureDescription}`);
            egg.style.display = "none";
            eggName.textContent = "All eggs hatched!";
            eggDesc.textContent = "";
            eggHP.textContent = "";
        }
    });
});
