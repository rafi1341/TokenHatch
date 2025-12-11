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

const egg = document.getElementById("egg");
const tokenCountDisplay = document.getElementById("token-count");

let tokens = 0;

egg.addEventListener("click", (e) => {
    // Increment token
    tokens++;
    tokenCountDisplay.textContent = tokens;

    // Hit animation
    egg.classList.add("hit");
    setTimeout(() => egg.classList.remove("hit"), 100);

    // Create floating +1
    const plus = document.createElement("div");
    plus.classList.add("floating-plus");
    plus.textContent = "+1";

    // Position relative to page (works on mobile)
    plus.style.position = "absolute";
    plus.style.left = `${e.pageX}px`;
    plus.style.top = `${e.pageY}px`;

    // Append to body so it shows above everything
    document.body.appendChild(plus);

    // Remove after animation
    setTimeout(() => plus.remove(), 800);
});



