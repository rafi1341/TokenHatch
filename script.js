// Current egg data
let currentEgg = {
    id: 4,
    name: 'Dragon Egg',
    emoji: '🥚',
    creature: '🐉',
    creatureName: 'Dragon',
    currentHP: 4500,
    requiredHP: 10000,
    hpPerTap: 10
};

// Tab Switching
function switchTab(tabName, event) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(tabName + '-screen').classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

// Floating Text Animation
function showFloatingText(text, x, y) {
    const floatText = document.createElement('div');
    floatText.className = 'float-text';
    floatText.textContent = text;
    floatText.style.left = x + 'px';
    floatText.style.top = y + 'px';
    document.body.appendChild(floatText);
    setTimeout(() => floatText.remove(), 1000);
}

// Update Progress Bar
function updateProgress() {
    const percentage = Math.min((currentEgg.currentHP / currentEgg.requiredHP) * 100, 100);
    document.getElementById('progress-bar').style.width = percentage + '%';
    document.getElementById('progress-percentage').textContent = Math.floor(percentage) + '%';
    document.getElementById('current-hp').textContent = currentEgg.currentHP.toLocaleString();
    document.getElementById('required-hp').textContent = currentEgg.requiredHP.toLocaleString();
}

// Tap Egg Function
function tapEgg(event) {
    currentEgg.currentHP += currentEgg.hpPerTap;

    const balanceEl = document.getElementById('hatch-balance');
    let currentBalance = parseInt(balanceEl.textContent.replace(/,/g, ''));
    currentBalance += currentEgg.hpPerTap;
    balanceEl.textContent = currentBalance.toLocaleString();

    showFloatingText('+' + currentEgg.hpPerTap, event.clientX, event.clientY);

    const egg = document.getElementById('main-egg');
    egg.style.transform = 'scale(0.9) rotate(-5deg)';
    setTimeout(() => egg.style.transform = 'scale(1) rotate(0deg)', 100);

    updateProgress();

    if (currentEgg.currentHP >= currentEgg.requiredHP) hatchEgg();
}

// Hatch Egg
function hatchEgg() {
    const egg = document.getElementById('main-egg');
    egg.textContent = currentEgg.creature;

    showFloatingText('🎉 ' + currentEgg.creatureName + ' HATCHED! 🎉', window.innerWidth / 2, window.innerHeight / 2);

    setTimeout(() => {
        alert(`🎉 Congratulations!\n\n${currentEgg.creatureName} has hatched!`);

        // Reset for next egg
        currentEgg = {
            id: 5,
            name: 'Eagle Egg',
            emoji: '🥚',
            creature: '🦅',
            creatureName: 'Eagle',
            currentHP: 0,
            requiredHP: 15000,
            hpPerTap: 10
        };

        egg.textContent = currentEgg.emoji;
        document.getElementById('egg-name').textContent = currentEgg.emoji + ' ' + currentEgg.name;
        document.getElementById('unlock-status').textContent = 'Tap to unlock ' + currentEgg.creatureName + '!';
        updateProgress();
    }, 1500);
}

// Collect Passive Income
function collectIncome(event) {
    const collectedEl = document.getElementById('collected-amount');
    let amount = parseInt(collectedEl.textContent);
    const balanceEl = document.getElementById('hatch-balance');
    let currentBalance = parseInt(balanceEl.textContent.replace(/,/g, ''));
    balanceEl.textContent = (currentBalance + amount).toLocaleString();

    showFloatingText('+' + amount + ' $HATCH', event.clientX, event.clientY);

    collectedEl.textContent = '0';

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
}

// Show Bonus
function showBonus() {
    const bonus = 500;
    const balanceEl = document.getElementById('hatch-balance');
    let currentBalance = parseInt(balanceEl.textContent.replace(/,/g, ''));
    balanceEl.textContent = (currentBalance + bonus).toLocaleString();
    showFloatingText('+' + bonus + ' Daily Bonus!', window.innerWidth / 2, window.innerHeight / 3);
}

// Show Referral
function showReferral() {
    alert('👥 Referral System\n\nInvite friends to earn:\n• 1,000 $HATCH per friend\n• 5 Points per 5 friends\n\nComing soon!');
}

// View Creature in Hatch Tab
function viewCreature(id) {
    alert('🐾 Creature #' + id + '\n\nUpgrade system coming soon!\n\nYou\'ll be able to:\n• Upgrade to Level 5\n• Increase passive income\n• Unlock special abilities');
}

// Initialize after DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    // Bind Egg Tap

    const BOT_API = "https://telegrambot-or4r.onrender.com"; // Your bot URL
    const API_SECRET = "383c5336-101c-4374-9cf9-44dd291db44c"; // Your secret
    
    document.getElementById('main-egg').addEventListener('click', tapEgg);

    // Bind Collect Button
    document.querySelector('.collect-btn').addEventListener('click', collectIncome);

    // Bind Bottom Nav Buttons
    document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(btn.getAttribute('data-tab'), e));
    });

    // Simulate Passive Income
    setInterval(() => {
        const collectedEl = document.getElementById('collected-amount');
        let current = parseInt(collectedEl.textContent);
        collectedEl.textContent = current + 2;
    }, 3000);

    // Initialize Progress
    updateProgress();
});
