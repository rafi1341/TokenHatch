// supabase.js

// --- Supabase setup ---
const SUPABASE_URL = "https://bvdaqngzsdsolfhphrlq.supabase.co"; // your project URL
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZGFxbmd6c2Rzb2xmaHBocmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTE5NTMsImV4cCI6MjA4MDk4Nzk1M30.-fDucAxLylPBnnsFuETB7hAF1VDHndGbdt47cyt_AyY"; // replace with your anon key
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Get Telegram user ID safely
const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "123456";

// Function to load tokens for this user
async function loadTokens() {
    try {
        const { data, error } = await supabaseClient
            .from('users_tokens')
            .select('tokens')
            .eq('id', userId)
            .single();

        if (error) {
            console.error("Supabase load error:", error);
            return 0;
        }

        if (data) {
            return data.tokens;
        } else {
            // Insert new user row
            await supabaseClient.from('users_tokens').insert({ id: userId, tokens: 0 });
            return 0;
        }
    } catch (err) {
        console.error("Supabase load exception:", err);
        return 0;
    }
}

// Function to save tokens
async function saveTokens(tokens) {
    try {
        await supabaseClient
            .from('users_tokens')
            .upsert({ id: userId, tokens: tokens });
    } catch (err) {
        console.error("Supabase save error:", err);
    }
}
