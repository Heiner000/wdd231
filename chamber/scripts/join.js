const learnMoreBtns = document.querySelectorAll(".card button");
const membershipModals = document.querySelector(".membership-modal");
// const closeBtns = document.querySelectorAll(".membership-modal button");

// do we need to create a dialog box? no, we have one in html

const membershipInfo = {
    "Non-Profit":
        "Non-Profit Membership is free and includes basic directory listing and event discounts.",
    Bronze: "Bronze Membership is perfect for small businesses. It includes enhanced directory listing and limited advertising opportunities.",
    Silver: "Silver Membership is ideal for growing businesses. It includes premium directory listing, advertising packages, and networking events.",
    Gold: "Gold Membership offers premium benefits for established businesses, including top-tier directory placement, sponsorship opportunities, and exclusive events.",
};

// add event listeners to learn mroe buttons
learnMoreBtns.forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".card");
        const heading = card.querySelector("h3");
        const membershipType = heading.textContent.split(" ")[0];
        const modalId = `${membershipType.toLowerCase()}-modal`;
        const modal = document.getElementById(modalId);

        modal.innerHTML = `
            <h2>${membershipType} Membership</h2>
            <p>${membershipInfo[membershipType]}</p>
            <button class="close-btn">Close</button>
        `;

        // Add event listener to the newly created close button
        const closeBtn = modal.querySelector(".close-btn");
        closeBtn.addEventListener("click", () => modal.close());

        modal.showModal();
    });
});

// add timestamp to form
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const timeStampField = document.querySelector("#timestamp");
    timeStampField.value = new Date().toISOString();
    // form.appendChild(timeStampField);
});
