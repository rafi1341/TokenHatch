document.addEventListener("DOMContentLoaded", () => {

    // --- Tab switching ---
    const tabBtns = document.querySelectorAll(".tab-btn");
    const screens = document.querySelectorAll(".screen");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            screens.forEach(s => s.classList.add("hidden"));
            document.getElementById(btn.dataset.tab).classList.remove("hidden");

            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
    const pb = new PocketBase('http://127.0.0.1:8090');
    const userId = "6648337638"; // Telegram user ID or test 
    pb.collection('users_tokens').getOne(userId).then(record => console.log(record));


    // --- Egg tapping logic ---
    const egg = document.getElementById("egg");
    const tokenCountDisplay = document.getElementById("token-count");
    let tokens = 0;

    if(!egg) {
        console.error("Egg element not found!");
        return;
    }

    egg.addEventListener("click", (e) => {
        // Increment tokens locally
        tokens++;
        tokenCountDisplay.textContent = tokens;

        // Hit animation
        egg.classList.add("hit");
        setTimeout(() => egg.classList.remove("hit"), 100);

        // Floating +1 animation
        const plus = document.createElement("div");
        plus.classList.add("floating-plus");
        plus.textContent = "+1";
        plus.style.position = "absolute";
        plus.style.left = `${e.pageX}px`;
        plus.style.top = `${e.pageY}px`;
        plus.style.color = "#fff";
        plus.style.fontWeight = "bold";
        plus.style.userSelect = "none";
        document.body.appendChild(plus);

        setTimeout(() => plus.remove(), 800);
    });

});
