const tabBtns = document.querySelectorAll(".tab-btn");
const screens = document.querySelectorAll(".screen");

// --- Tab switching ---
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.tab;

        screens.forEach(s => s.classList.add("hidden"));
        document.getElementById(target).classList.remove("hidden");

        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const egg = document.getElementById("egg");
    const tokenCountDisplay = document.getElementById("token-count");

    // --- Step 5: Initialize Supabase ---
    const SUPABASE_URL = "const tabBtns = document.querySelectorAll(".tab-btn");
const screens = document.querySelectorAll(".screen");

// --- Tab switching ---
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.tab;

        screens.forEach(s => s.classList.add("hidden"));
        document.getElementById(target).classList.remove("hidden");

        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const egg = document.getElementById("egg");
    const tokenCountDisplay = document.getElementById("token-count");

    // --- Step 5: Initialize Supabase ---
    const SUPABASE_URL = "https://bvdaqngzsdsolfhphrlq.supabase.co";   // replace with your Supabase project URL
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZGFxbmd6c2Rzb2xmaHBocmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTE5NTMsImV4cCI6MjA4MDk4Nzk1M30.-fDucAxLylPBnnsFuETB7hAF1VDHndGbdt47cyt_AyY";      // replace with your anon public key
    const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // --- Step 6: Get Telegram user ID ---
    const userId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();

    let tokens = 0;

    // --- Step 7: Fetch tokens on load ---
    async function loadTokens() {
        const { data, error } = await supabase
            .from('users_tokens')
            .select('tokens')
            .eq('id', userId)
            .single();

        if (data) {
            tokens = data.tokens;
            tokenCountDisplay.textContent = tokens;
        } else {
            // No row yet for this user → insert initial
            await supabase.from('users_tokens').insert({ id: userId, tokens: 0 });
            tokenCountDisplay.textContent = 0;
        }
    }

    loadTokens();

    // --- Step 8: Update tokens on click ---
    async function incrementToken() {
        tokens++;
        tokenCountDisplay.textContent = tokens;

        await supabase
            .from('users_tokens')
            .upsert({ id: userId, tokens: tokens });
    }

    egg.addEventListener("click", async (e) => {
        await incrementToken();

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
    });
});
";   // replace with your Supabase project URL
    const SUPABASE_KEY = "YOUR_ANON_KEY";      // replace with your anon public key
    const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // --- Step 6: Get Telegram user ID ---
    const userId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();

    let tokens = 0;

    // --- Step 7: Fetch tokens on load ---
    async function loadTokens() {
        const { data, error } = await supabase
            .from('users_tokens')
            .select('tokens')
            .eq('id', userId)
            .single();

        if (data) {
            tokens = data.tokens;
            tokenCountDisplay.textContent = tokens;
        } else {
            // No row yet for this user → insert initial
            await supabase.from('users_tokens').insert({ id: userId, tokens: 0 });
            tokenCountDisplay.textContent = 0;
        }
    }

    loadTokens();

    // --- Step 8: Update tokens on click ---
    async function incrementToken() {
        tokens++;
        tokenCountDisplay.textContent = tokens;

        await supabase
            .from('users_tokens')
            .upsert({ id: userId, tokens: tokens });
    }

    egg.addEventListener("click", async (e) => {
        await incrementToken();

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
    });
});
