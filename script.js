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

    // --- Egg and token setup ---
    const egg = document.getElementById("egg");
    const tokenCountDisplay = document.getElementById("token-count");
    let tokens = 0;

    // --- Supabase setup ---
    const SUPABASE_URL = "https://bvdaqngzsdsolfhphrlq.supabase.co";
    const SUPABASE_KEY = "YOUR_ANON_KEY";
    const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "123456";

    // --- Load tokens safely ---
    async function loadTokens() {
        try {
            const { data, error } = await supabase
                .from('users_tokens')
                .select('tokens')
                .eq('id', userId)
                .single();

            if (data) tokens = data.tokens;
            else await supabase.from('users_tokens').insert({ id: userId, tokens: 0 });

        } catch (err) {
            console.error("Supabase loadTokens error:", err);
        } finally {
            tokenCountDisplay.textContent = tokens;
        }
    }

    loadTokens();

    // --- Increment tokens ---
    async function saveTokens() {
        try {
            await supabase
                .from('users_tokens')
                .upsert({ id: userId, tokens: tokens });
        } catch (err) {
            console.error("Supabase saveTokens error:", err);
        }
    }

    // --- Egg click handler ---
    egg.addEventListener("click", (e) => {
        // Increment tokens locally
        tokens++;
        tokenCountDisplay.textContent = tokens;

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
        try {
        supabase
            .from('users_tokens')
            .upsert({ id: userId, tokens: tokens });
        } catch(err) {
        console.error("Supabase save failed:", err);
    }
        // Save asynchronously
        saveTokens();
    });

});
