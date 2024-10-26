// FAQ accordion functionality
document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains("active");

        // close all other answers
        document.querySelectorAll(".faq-question").forEach((q) => {
            if (q !== question && q.classList.contains("active")) {
                const otherAns = q.nextElementSibling;

                // add closing animation
                otherAns.classList.add("closing");

                // wait for animation to complete before fully closing
                setTimeout(() => {
                    q.classList.remove("active");
                    otherAns.classList.remove("active", "closing");
                }, 300);
            }
        });

        // toggle clicked question
        if (!isActive) {
            // remove any closing animation class first
            answer.classList.remove("closing");

            // add active classes to show the answer
            question.classList.add("active");
            answer.classList.add("active");
        } else {
            // add closing animation
            answer.classList.add("closing");

            // wait for animation to complete before removing active class
            setTimeout(() => {
                question.classList.remove("active");
                answer.classList.remove("active", "closing");
            }, 250);
        }
    });
});
