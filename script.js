
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

        // Tap Egg Function
        function tapEgg(event) {
            // Add HP
            currentEgg.currentHP += currentEgg.hpPerTap;
            
            // Add $HATCH to balance
            const currentBalance = parseInt(document.getElementById('hatch-balance').textContent.replace(/,/g, ''));
            document.getElementById('hatch-balance').textContent = (currentBalance + currentEgg.hpPerTap).toLocaleString();
            
            // Show floating text at click position
            showFloatingText('+' + currentEgg.hpPerTap, event.clientX, event.clientY);
            
            // Update progress
            updateProgress();
            
            // Egg shake animation
            const egg = document.getElementById('main-egg');
            egg.style.transform = 'scale(0.9) rotate(-5deg)';
            setTimeout(() => {
                egg.style.transform = 'scale(1) rotate(0deg)';
            }, 100);
            
            // Check if hatched
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
            // Celebration!
            const egg = document.getElementById('main-egg');
            egg.textContent = currentEgg.creature;
            
            // Show big celebration text
            showFloatingText('🎉 ' + currentEgg.creatureName + ' HATCHED! 🎉', window.innerWidth / 2, window.innerHeight / 2);
            
            setTimeout(() => {
                alert('🎉 Congratulations!\n\n' + currentEgg.creatureName + ' has hatched!\n\nGo to Hatch tab to upgrade your new creature!');
                
                // Reset for next egg (this would come from backend in real app)
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
            
            // Simulate new income accumulation
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

        // Initialize
        updateProgress();

        // Simulate passive income accumulation
        setInterval(() => {
            const current = parseInt(document.getElementById('collected-amount').textContent);
            if (current < 500) {
                document.getElementById('collected-amount').textContent = current + 2;
            }
        }, 3000);
