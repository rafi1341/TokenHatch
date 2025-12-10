const tabBtns = document.querySelectorAll(".tab-btn");
const screens = document.querySelectorAll(".screen");

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.tab;

        // Hide all screens
        screens.forEach(screen => screen.classList.add("hidden"));
        // Show clicked screen
        document.getElementById(target).classList.remove("hidden");

        // Active button styling
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

// ------------------- Tabs Code -------------------
const tabBtns = document.querySelectorAll(".tab-btn");
const screens = document.querySelectorAll(".screen");

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.tab;

        // Hide all screens
        screens.forEach(screen => screen.classList.add("hidden"));
        // Show clicked screen
        document.getElementById(target).classList.remove("hidden");

        // Active button styling
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

// ------------------- Egg Hatching Game -------------------
document.addEventListener('DOMContentLoaded', () => {
    const eggs = [
        { hp: 3, creature: 'assets/creature1.png' },
        { hp: 4, creature: 'assets/creature2.png' },
        { hp: 5, creature: 'assets/creature3.png' }
    ];
    let currentLevel = 0;

    const eggContainer = document.querySelector('.egg-container');
    const creatureImage = document.getElementById('creature-image');
    const creatureDiv = document.getElementById('creature-unlocked');

    function showEgg(level) {
        eggContainer.innerHTML = '';
        if(level >= eggs.length){
            eggContainer.innerHTML = '<p>All eggs hatched!</p>';
            return;
        }

        const egg = document.createElement('div');
        egg.classList.add('egg');
        egg.dataset.hp = eggs[level].hp;

        const img = document.createElement('img');
        img.src = 'assets/egg.png'; // egg image path
        egg.appendChild(img);

        eggContainer.appendChild(egg);

        egg.addEventListener('click', () => {
            let hp = parseInt(egg.dataset.hp) - 1;
            egg.dataset.hp = hp;
            egg.classList.add('hit');
            setTimeout(() => egg.classList.remove('hit'), 100);

            if(hp <= 0){
                hatchEgg(level);
            }
        });
    }

    function hatchEgg(level){
        const egg = document.querySelector('.egg');
        egg.style.display = 'none';
        creatureImage.src = `assets/${eggs[level].creature}`; // creature image path
        creatureDiv.classList.remove('hidden');

        setTimeout(() => {
            creatureDiv.classList.add('hidden');
            currentLevel++;
            showEgg(currentLevel);
        }, 1000);
    }

    // Start first egg
    showEgg(currentLevel);
});
