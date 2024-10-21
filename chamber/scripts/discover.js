document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll(".gallery img[data-src]");

    const imgOptions = {
        threshold: 0;
        rootMargin: "0px 0px 50px 0px"
    };

    const imgObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                preloadImage(entry.target);
                imgObserver.unobserve(entry.target);
            }
        });
    }, imgOptions);

    images.forEach(image => {
        imgObserver.observe(image);
    });

    function preloadImage(img) {
        const src = img.getAttribute("data-src");
        if (!src) {
            return;
        }
        img.src = src;
    }
});

// visit message functionality
document.addEventListener("DOMContentLoaded", function() {
    const visitMessage = document.querySelector("#visit-message");
    const lastVisit = localStorage.getItem("lastVisit");
    const currentDate = Date.now();

    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any qyestions.";
    } else {
        const daysBetween = Math.round((currentDate - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));

        if (daysBetween < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else if (daysBetween === 1) {
            visitMessage.textContent = "You last visited 1 day ago.";
        } else {
            visitMessage.textContent = `You last visited ${daysBetween} days ago.`;
        }
    }
    localStorage.setItem("lastVisit", currentDate.toString());
})