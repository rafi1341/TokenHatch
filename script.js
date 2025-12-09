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
