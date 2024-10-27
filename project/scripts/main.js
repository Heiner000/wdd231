// Update copyright  & last modified
const currentYear = new Date().getFullYear();
document.getElementById("current-year").textContent = currentYear;

const lastModified = document.lastModified;
document.getElementById(
    "lastModified"
).textContent = `Last Modified: ${document.lastModified}`;

// navigation funcionality
function initNavigation() {
    const menuButton = document.querySelector("#menuButton");
    const nav = document.querySelector("nav");

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            nav.classList.toggle("open");
            menuButton.classList.toggle("open");
        });

        // close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (!nav.contains(e.target) && !menuButton.contains(e.target)) {
                nav.classList.remove("open");
                menuButton.classList.remove("open");
            }
        });

        // close menu when clicking a link
        const navLinks = nav.querySelectorAll("a");
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                menuButton.classList.remove("open");
            });
        });
    }
}

// wayfinding functionality
const initWayfinding = () => {
    // get current page URL
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    // find & mark active link
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
};

// initialize navigation when DOM is loaded
document.addEventListener("DOMContentLoaded", (e) => {
    initNavigation();
    initWayfinding();
});
