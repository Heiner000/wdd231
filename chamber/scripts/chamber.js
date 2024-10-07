// Mobile menu toggle
const menuToggle = document.querySelector("#menu-toggle");
const navElement = document.querySelector("#animate-me");

menuToggle.addEventListener("click", () => {
    navElement.classList.toggle("open");
    menuToggle.classList.toggle("open");
});

// Update copyright  & last modified
const currentYear = new Date().getFullYear();
document.getElementById("current-year").textContent = currentYear;

const lastModified = document.lastModified;
document.getElementById(
    "lastModified"
).textContent = `Last Modified: ${document.lastModified}`;

// view toggle functions
const gridViewBtn = document.querySelector("#grid-view");
const listViewBtn = document.querySelector("#list-view");
const cardsContainer = document.querySelector("#cards");

gridViewBtn.addEventListener("click", () => {
    cardsContainer.className = "grid-view";
});

listViewBtn.addEventListener("click", () => {
    cardsContainer.className = "list-view";
});

// fetch members data
async function fetchMembersData() {
    try {
        const response = await fetch("./data/members.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Could not fetch member data: ", err);
    }
}

// display members
const displayMembers = (members) => {
    const cards = document.querySelector("#cards");
    cards.innerHTML = "";

    members.forEach((member) => {
        const memberCard = document.createElement("section");
        memberCard.className = "member-card";

        if (cards.className === "grid-view") {
            memberCard.innerHTML = `
            <img src="images/${member.image}" alt="${
                member.name
            } logo" class="member-logo" height="50">
            <h2>${member.name}</h2>
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p>Website: <a href="${member.website}" target="_blank">${
                member.website
            }</a></p>
            <p>Industry: ${member.industry}</p>
            <p>Employees: ${member.employeeCount}</p>
            <p>Founded: ${member.yearFounded}</p>
            <p>Membership Level: ${getMembershipLevel(
                member.membershipLevel
            )}</p>
        `;
        } else {
            memberCard.innerHTML = `
                <h2>${member.name}</h2>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <p><a href="${member.website}" target="_blank">${member.website}</a></p>
            `;
        }
        cards.appendChild(memberCard);
    });
};

// identify membership level
function getMembershipLevel(level) {
    switch (level) {
        case 1:
            return "Member";
        case 2:
            return "Silver";
        case 3:
            return "Gold";
        default:
            return "Unknown";
    }
}

// fetch and display data
async function initializePage() {
    const members = await fetchMembersData();
    if (members) {
        displayMembers(members);
        cardsContainer.className = "grid-view";
    }
}

// call initialize function when page loads
window.addEventListener("load", initializePage);
