// Creatures database (example)
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

        // Open Creature Detail
        function openCreatureDetail(creatureId) {
            selectedCreature = creatures[creatureId];
            if (!selectedCreature) return;

            // Sync balance displays
            syncBalanceDisplays();

            // Populate detail screen
            document.getElementById('detail-creature-name').textContent = selectedCreature.name;
            document.getElementById('detail-creature-title').textContent = selectedCreature.name;
            document.getElementById('detail-creature-img').src = selectedCreature.image;
            document.getElementById('detail-creature-level').textContent = `Level ${selectedCreature.currentLevel}/${selectedCreature.maxLevel}`;
            document.getElementById('detail-current-income').textContent = `+${selectedCreature.currentIncome} $HATCH/hr`;
            document.getElementById('detail-total-earned').textContent = `${selectedCreature.totalEarned.toLocaleString()} $HATCH`;
            document.getElementById('detail-upgrade-cost').textContent = `${selectedCreature.upgradeCost.toLocaleString()} $HATCH`;

            // Update upgrade section
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

            // Show detail screen
            document.getElementById('creature-detail').classList.add('active');
        }

        // Sync balance displays between main and detail screens
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
                // Deduct cost
                const newBalance = currentBalance - selectedCreature.upgradeCost;
                document.getElementById('hatch-balance').textContent = newBalance.toLocaleString();
                syncBalanceDisplays(); // Update detail screen balance too
                
                // Upgrade creature
                selectedCreature.currentLevel++;
                selectedCreature.currentIncome = selectedCreature.nextLevelIncome;
                selectedCreature.upgradeCost = Math.floor(selectedCreature.upgradeCost * 2.5);
                selectedCreature.nextLevelIncome = Math.floor(selectedCreature.nextLevelIncome * 2);
                
                // Update passive income
                const passiveIncome = parseInt(document.getElementById('passive-income').textContent);
                document.getElementById('passive-income').textContent = passiveIncome + 50;
                
                // Show success
                showFloatingText('🎉 Upgraded!', window.innerWidth / 2, window.innerHeight / 2);
                
                // Refresh detail screen
                setTimeout(() => {
                    openCreatureDetail(selectedCreature.id);
                }, 500);
            } else {
                alert('❌ Not enough $HATCH!\n\nNeed: ' + selectedCreature.upgradeCost.toLocaleString() + '\nHave: ' + currentBalance.toLocaleString());
            }
        }

        // Tap Egg Function
        function tapEgg(event) {
            currentEgg.currentHP += currentEgg.hpPerTap;
            
            const currentBalance = parseInt(document.getElementById('hatch-balance').textContent.replace(/,/g, ''));
            document.getElementById('hatch-balance').textContent = (currentBalance + currentEgg.hpPerTap).toLocaleString();
            syncBalanceDisplays(); // Sync with detail screen
            
            showFloatingText('+' + currentEgg.hpPerTap, event.clientX, event.clientY);
            
            updateProgress();
            
            const egg = document.getElementById('main-egg');
            egg.style.transform = 'scale(0.9) rotate(-5deg)';
            setTimeout(() => {
                egg.style.transform = 'scale(1) rotate(0deg)';
            }, 100);
            
            if (currentEgg.currentHP >= currentEgg.requiredHP) {
                hatchEgg();
            }
        }

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
                
                // Move to next egg (dummy)
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
            syncBalanceDisplays(); // Sync with detail screen
            document.getElementById('collected-amount').textContent = '0';
            
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
            syncBalanceDisplays(); // Sync with detail screen
            showFloatingText('+' + bonus + ' Daily Bonus!', window.innerWidth / 2, window.innerHeight / 3);
        }

        // Show Referral
        function showReferral() {
            alert('👥 Referral System\n\nInvite friends to earn:\n• 1,000 $HATCH per friend\n• 5 Points per 5 friends\n\nComing soon!');
        }

        // Initialize
        updateProgress();

        // Simulate passive income accumulation
        setInterval(() => {
            const current = parseInt(document.getElementById('collected-amount').textContent);
            if (current < 500) {
                document.getElementById('collected-amount').textContent = current + 2;
            }
        }, 3000);
