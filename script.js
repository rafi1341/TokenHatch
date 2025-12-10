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
