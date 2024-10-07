import { fetchMembersData, getMembershipLevel } from "./common.js";

function filterGoldSilverMembers(members) {
    return members.filter((member) => member.membershipLevel >= 2);
}

function getRandomSpotlightMembers(members) {
    const numOfSpotlights = Math.floor(Math.random() * 2) + 2;
    const shuffled = members.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numOfSpotlights);
}

function displaySpotlightMembers(members) {
    const spotlightContainer = document.querySelector("#spotlight");
    spotlightContainer.innerHTML = "";

    members.forEach((member) => {
        const memberSpotlight = document.createElement("div");
        memberSpotlight.className = "member-spotlight";
        memberSpotlight.innerHTML = `
        <img src="images/${member.image}" alt="${
            member.name
        } logo" class="member-logo" height="50">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p><a href="${member.website}" target="_blank">${
            member.website
        }</a></p>
            <p>Membership Level: ${getMembershipLevel(
                member.membershipLevel
            )}</p>
        `;
        spotlightContainer.appendChild(memberSpotlight);
    });
}

async function initializeSpotlight() {
    const members = await fetchMembersData();
    if (members) {
        const GoldSilverMembers = filterGoldSilverMembers(members);
        const spotlightMembers = getRandomSpotlightMembers(GoldSilverMembers);
        displaySpotlightMembers(spotlightMembers);
    }
}

document.addEventListener("DOMContentLoaded", initializeSpotlight);
