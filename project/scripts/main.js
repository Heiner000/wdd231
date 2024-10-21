// Update copyright  & last modified
const currentYear = new Date().getFullYear();
document.getElementById("current-year").textContent = currentYear;

const lastModified = document.lastModified;
document.getElementById(
    "lastModified"
).textContent = `Last Modified: ${document.lastModified}`;
