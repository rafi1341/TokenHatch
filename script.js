// Configuration
const BOT_API = "https://telegrambot-or4r.onrender.com"; // ← CHANGE THIS
const API_SECRET = "383c5336-101c-4374-9cf9-44dd291db44c"; // ← CHANGE THIS

// Get Telegram user ID
const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "test_user_123";
console.log("User ID:", userId);

// Batching variables
let pendingTokens = 0; // Tokens waiting to be sent to backend
let saveTimeout = null;

// Creatures database
const creatures = {
    1: {
        id: 1,
        name: 'Chick',
        image: 'assets/creatures/creature_chick.png',
        currentLevel: 3,
        maxLevel: 5,
        currentIncome: 50,
        nextLevelIncome: 100,
        upgradeCost: 2500,
        totalEarned: 45200
    },
    2: {
        id: 2,
        name: 'Turtle',
        image: 'assets/creatures/creature_turtle.png',
        currentLevel: 2,
        maxLevel: 5,
        currentIncome: 100,
        nextLevelIncome: 200,
        upgradeCost: 5000,
        totalEarned: 28500
    },
    3: {
        id: 3,
        name: 'Lizard',
        image: 'assets/creatures/creature_lizard.png',
        currentLevel: 1,
        maxLevel: 5,
        currentIncome: 100,
        nextLevelIncome: 200,
        upgradeCost: 7500,
        totalEarned: 12000
    }
};

let selectedCreature = null;

// Current egg data
let currentEgg = {
    id: 4,
    name: 'Dragon Egg',
    eggImage: 'assets/eggs/egg_dragon.png',
    creatureImage: 'assets/creatures/creature_dragon.png',
    creatureName: 'Dragon',
    currentHP: 4500,
    requiredHP: 10000,
    hpPerTap: 10
};

// Load balance from backend on startup
async function loadBalanceFromBackend() {
    console.log("🔄 Loading balance from backend...");
    
    // Check localStorage for unsaved tokens first
    const unsavedTokens = parseInt(localStorage.getItem(`unsaved_${userId}`)) || 0;
    if (unsavedTokens > 0) {
        console.log("💾 Found unsaved tokens:", unsavedTokens);
        await sendBatchToBackend(unsavedTokens);
        localStorage.removeItem(`unsaved_${userId}`);
    }
    
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
        const balance = data.balance || 0;
        
        document.getElementById('hatch-balance').textContent = balance.toLocaleString();
        syncBalanceDisplays();
        
        console.log("✅ Loaded balance:", balance);
    } catch (e) {
        console.error("❌ Failed to load balance:", e);
    }
}

// Send batched tokens to backend
async function sendBatchToBackend(amount) {
    console.log("📤 Sending batch to backend: +", amount, "tokens");
    
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
        console.log("✅ Backend response:", data);
        
        // Update balance from backend response
        if (data.new_balance) {
            document.getElementById('hatch-balance').textContent = data.new_balance.toLocaleString();
            syncBalanceDisplays();
        }
        
        // Clear localStorage backup after successful send
        localStorage.removeItem(`unsaved_${userId}`);
    } catch (e) {
        console.error("❌ Failed to send batch:", e);
        // Keep in localStorage for retry on next load
    }
}

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + '-screen').classList.add('active');
    event.currentTarget.classList.add('active');
}

// Tap Egg Function - WITH 2-SECOND BATCHING
function tapEgg(event) {
    // Update egg HP immediately (local)
    currentEgg.currentHP += currentEgg.hpPerTap;
    
    // Update balance display immediately (local)
    const currentBalance = parseInt(document.getElementById('hatch-balance').textContent.replace(/,/g, ''));
    document.getElementById('hatch-balance').textContent = (currentBalance + currentEgg.hpPerTap).toLocaleString();
    syncBalanceDisplays();
    
    // Add to pending batch
    pendingTokens += currentEgg.hpPerTap;
    
    // Save to localStorage immediately (backup)
    localStorage.setItem(`unsaved_${userId}`, pendingTokens);
    
    // Show floating text
    showFloatingText('+' + currentEgg.hpPerTap, event.clientX, event.clientY);
    
    // Update progress bar
    updateProgress();
    
    // Egg animation
    const egg = document.getElementById('main-egg');
    egg.style.transform = 'scale(0.9) rotate(-5deg)';
    setTimeout(() => {
        egg.style.transform = 'scale(1) rotate(0deg)';
    }, 100);
    
    // ⭐ BATCH SENDING - Every 2 seconds
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        if (pendingTokens > 0) {
            console.log(`📦 Batching ${pendingTokens} taps into ONE backend call`);
            sendBatchToBackend(pendingTokens);
            pendingTokens = 0;
        }
    }, 2000); // 2 seconds - YOUR EXISTING INTERVAL
    
    // Check if egg should hatch
    if (currentEgg.currentHP >= currentEgg.requiredHP) {
        hatchEgg();
    }
}

// Also send pending tokens when user closes/switches away
window.addEventListener('beforeunload', () => {
    if (pendingTokens > 0) {
        console.log("🚪 App closing, saving pending tokens:", pendingTokens);
        const data = new Blob([JSON.stringify({
            user_id: userId,
            tokens: pendingTokens,
            api_secret: API_SECRET
        })], { type: 'application/json' });
        navigator.sendBeacon(`${BOT_API}/update_tokens`, data);
    }
});

window.addEventListener('blur', () => {
    if (pendingTokens > 0) {
        console.log("👋 App lost focus, saving pending tokens:", pendingTokens);
        sendBatchToBackend(pendingTokens);
        pendingTokens = 0;
        clearTimeout(saveTimeout);
    }
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && pendingTokens > 0) {
        console.log("🙈 App hidden, saving pending tokens:", pendingTokens);
        sendBatchToBackend(pendingTokens);
        pendingTokens = 0;
        clearTimeout(saveTimeout);
    }
});

// Update Progress Bar
function updateProgress() {
    const percentage = Math.min((currentEgg.currentHP / currentEgg.requiredHP) * 100, 100);
    document.getElementById('progress-bar').style.width = percentage + '%';
    document.getElementById('progress-percentage').textContent = Math.floor(percentage) + '%';
    document.getElementById('current-hp').textContent = currentEgg.currentHP.toLocaleString();
    document.getElementById('required-hp').textContent = currentEgg.requiredHP.toLocaleString();
}

// Hatch Egg
function hatchEgg() {
    const egg = document.getElementById('main-egg');
    egg.src = currentEgg.creatureImage;
    
    showFloatingText('🎉 ' + currentEgg.creatureName + ' HATCHED! 🎉', window.innerWidth / 2, window.innerHeight / 2);
    
    setTimeout(() => {
        alert('🎉 Congratulations!\n\n' + currentEgg.creatureName + ' has hatched!\n\nGo to Hatch tab to upgrade your new creature!');
        
        // Move to next egg
        currentEgg = {
            id: 5,
            name: 'Eagle Egg',
            eggImage: 'assets/eggs/egg_eagle.png',
            creatureImage: 'assets/creatures/creature_eagle.png',
            creatureName: 'Eagle',
            currentHP: 0,
            requiredHP: 15000,
            hpPerTap: 10
        };
        
        egg.src = currentEgg.eggImage;
        document.getElementById('egg-name').textContent = currentEgg.creatureName + ' Egg';
        document.getElementById('unlock-status').textContent = 'Tap to unlock ' + currentEgg.creatureName + '!';
        updateProgress();
    }, 2000);
}

// Floating Text Animation
function showFloatingText(text, x, y) {
    const floatText = document.createElement('div');
    floatText.className = 'float-text';
    floatText.textContent = text;
    floatText.style.left = x + 'px';
    floatText.style.top = y + 'px';
    document.body.appendChild(floatText);
    
    setTimeout(() => {
        floatText.remove();
    }, 1000);
}

// Collect Passive Income
function collectIncome() {
    const amount = parseInt(document.getElementById('collected-amount').textContent);
    const currentBalance = parseInt(document.getElementById('hatch-balance').textContent.replace(/,/g, ''));
    const newBalance = currentBalance + amount;
    
    document.getElementById('hatch-balance').textContent = newBalance.toLocaleString();
    syncBalanceDisplays();
    document.getElementById('collected-amount').textContent = '0';
    
    // Send to backend immediately
    sendBatchToBackend(amount);
    
    showFloatingText('+' + amount + ' $HATCH', event.clientX, event.clientY);
    
    const btn = event.target;
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Collected! ✅';
    btn.style.background = '#00d68f';
    
    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
        btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 2000);
    
    // Simulate new accumulation
    setTimeout(() => {
        let accumulated = 0;
        const interval = setInterval(() => {
            accumulated += 5;
            document.getElementById('collected-amount').textContent = accumulated;
            if (accumulated >= 100) clearInterval(interval);
        }, 2000);
    }, 3000);
}

// Show Bonus
function showBonus() {
    const bonus = 500;
    const currentBalance = parseInt(document.getElementById('hatch-balance').textContent.replace(/,/g, ''));
    document.getElementById('hatch-balance').textContent = (currentBalance + bonus).toLocaleString();
    syncBalanceDisplays();
    
    // Send to backend immediately
    sendBatchToBackend(bonus);
    
    showFloatingText('+' + bonus + ' Daily Bonus!', window.innerWidth / 2, window.innerHeight / 3);
}

// Show Referral
function showReferral() {
    alert('👥 Referral System\n\nInvite friends to earn:\n• 1,000 $HATCH per friend\n• 5 Points per 5 friends\n\nComing soon!');
}

// Open Creature Detail
function openCreatureDetail(creatureId) {
    selectedCreature = creatures[creatureId];
    if (!selectedCreature) return;

    syncBalanceDisplays();

    document.getElementById('detail-creature-name').textContent = selectedCreature.name;
    document.getElementById('detail-creature-title').textContent = selectedCreature.name;
    document.getElementById('detail-creature-img').src = selectedCreature.image;
    document.getElementById('detail-creature-level').textContent = `Level ${selectedCreature.currentLevel}/${selectedCreature.maxLevel}`;
    document.getElementById('detail-current-income').textContent = `+${selectedCreature.currentIncome} $HATCH/hr`;
    document.getElementById('detail-total-earned').textContent = `${selectedCreature.totalEarned.toLocaleString()} $HATCH`;
    document.getElementById('detail-upgrade-cost').textContent = `${selectedCreature.upgradeCost.toLocaleString()} $HATCH`;

    const upgradeBtn = document.querySelector('.upgrade-btn');
    if (selectedCreature.currentLevel >= selectedCreature.maxLevel) {
        upgradeBtn.disabled = true;
        upgradeBtn.textContent = 'MAX LEVEL REACHED';
        document.querySelector('.upgrade-header').textContent = '⭐ Maximum Level';
    } else {
        upgradeBtn.disabled = false;
        upgradeBtn.textContent = 'UPGRADE NOW';
        document.querySelector('.upgrade-header').textContent = `⬆️ Upgrade to Level ${selectedCreature.currentLevel + 1}`;
    }

    document.getElementById('creature-detail').classList.add('active');
}

// Sync balance displays
function syncBalanceDisplays() {
    const mainBalance = document.getElementById('hatch-balance').textContent;
    const mainPoints = document.getElementById('points-balance').textContent;
    const detailBalance = document.getElementById('hatch-balance-detail');
    const detailPoints = document.getElementById('points-balance-detail');
    
    if (detailBalance) detailBalance.textContent = mainBalance;
    if (detailPoints) detailPoints.textContent = mainPoints;
}

// Close Creature Detail
function closeCreatureDetail() {
    document.getElementById('creature-detail').classList.remove('active');
    selectedCreature = null;
}

// Upgrade Creature
function upgradeCreature() {
    if (!selectedCreature) return;

    const currentBalance = parseInt(document.getElementById('hatch-balance').textContent.replace(/,/g, ''));
    
    if (currentBalance >= selectedCreature.upgradeCost) {
        const newBalance = currentBalance - selectedCreature.upgradeCost;
        document.getElementById('hatch-balance').textContent = newBalance.toLocaleString();
        syncBalanceDisplays();
        
        // Send negative amount to backend (spending tokens)
        sendBatchToBackend(-selectedCreature.upgradeCost);
        
        selectedCreature.currentLevel++;
        selectedCreature.currentIncome = selectedCreature.nextLevelIncome;
        selectedCreature.upgradeCost = Math.floor(selectedCreature.upgradeCost * 2.5);
        selectedCreature.nextLevelIncome = Math.floor(selectedCreature.nextLevelIncome * 2);
        
        const passiveIncome = parseInt(document.getElementById('passive-income').textContent);
        document.getElementById('passive-income').textContent = passiveIncome + 50;
        
        showFloatingText('🎉 Upgraded!', window.innerWidth / 2, window.innerHeight / 2);
        
        setTimeout(() => {
            openCreatureDetail(selectedCreature.id);
        }, 500);
    } else {
        alert('❌ Not enough $HATCH!\n\nNeed: ' + selectedCreature.upgradeCost.toLocaleString() + '\nHave: ' + currentBalance.toLocaleString());
    }
}

// Initialize on page load
loadBalanceFromBackend();
updateProgress();

// Simulate passive income accumulation
setInterval(() => {
    const current = parseInt(document.getElementById('collected-amount').textContent);
    if (current < 500) {
        document.getElementById('collected-amount').textContent = current + 2;
    }
}, 3000);
