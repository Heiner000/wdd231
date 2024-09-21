import courses from "./courses.js";

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
});

// Update copyright  & last modified
const currentYear = new Date().getFullYear();
document.getElementById("current-year").textContent = currentYear;

const lastModified = document.lastModified;
document.getElementById(
    "lastModified"
).textContent = `Last Modified: ${document.lastModified}`;

// display courses
const courseContainer = document.querySelector(".course-btns");

function displayCourses(coursesToDisplay) {
    courseContainer.innerHTML = "";
    coursesToDisplay.forEach((course) => {
        const button = document.createElement("button");
        button.textContent = `${course.subject} ${course.number}`;
        button.classList.add(course.completed ? "completed" : "not-completed");
        courseContainer.appendChild(button);
    });
}

displayCourses(courses);

// filter courses
const filterBUttons = document.querySelectorAll(".cert-btns button");

filterBUttons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.textContent;
        let filteredCourses;

        if (filter === "All") {
            filteredCourses = courses;
        } else {
            filteredCourses = courses.filter(
                (course) => course.subject === filter
            );
        }

        displayCourses(filteredCourses);
    });
});

// credit count
const completedCredits = courses.reduce(
    (total, course) => (course.completed ? total + course.credits : total),
    0
);
const totalCredits = courses.reduce(
    (total, course) => total + course.credits,
    0
);

const creditsElement = document.createElement("p");
creditsElement.textContent = `Total Credits = ${completedCredits} / ${totalCredits}`;
document
    .querySelector(".certificates .card-content")
    .appendChild(creditsElement);
