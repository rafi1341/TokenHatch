document.addEventListener("DOMContentLoaded", () => {

    // --- Tab switching ---
    const tabBtns = document.querySelectorAll(".tab-btn");
    const screens = document.querySelectorAll(".screen");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.tab;

            screens.forEach(s => s.classList.add("hidden"));
            document.getElementById(target).classList.remove("hidden");

            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    // --- Egg tapping logic ---
    const egg = document.getElementById("egg");
    const tokenCountDisplay = document.getElementById("token-count");

    // --- Supabase setup ---
    const SUPABASE_URL = "https://bvdaqngzsdsolfhphrlq.supabase.co"; // your project URL
    const SUPABASE_KEY = "YOUR_ANON_KEY"; // replace with your anon key
    const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // --- Get Telegram user ID safely ---
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "123456";

    let tokens = 0;

    // --- Load tokens from Supabase ---
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
            await supabase.from('users_tokens').insert({ id: userId, tokens: 0 });
            tokenCountDisplay.textContent = 0;
        }
    }

    loadTokens();

    // --- Increment tokens and update Supabase ---
    async function incrementToken() {
        tokens++;
        tokenCountDisplay.textContent = tokens;

        await supabase
            .from('users_tokens')
            .upsert({ id: userId, tokens: tokens });
    }

    // --- Egg click handler ---
    egg.addEventListener("click", (e) => {
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

        // Increment tokens locally
        tokens++;
        tokenCountDisplay.textContent = tokens;

        // Save to Supabase asynchronously (does not block animation)
        incrementToken();
    });

});
