import { testProperties, filterProperties } from "../data/testData.js";

const API_KEY = "";
const API_HOST = "redfin-com-data.p.rapidapi.com";

// async function searchProperties(location, propertyType, minPrice, maxPrice) {
//     const url = `https://${API_HOST}/property/search?location=${encodeURIComponent(
//         location
//     )}`;
//     const options = {
//         method: "GET",
//         headers: {
//             "x-rapidapi-key": API_KEY,
//             "x-rapidapi-host": API_HOST,
//         },
//     };

//     try {
//         const response = await fetch(url, options);
//         const result = await response.json();
//         return result.data.homes;
//     } catch (err) {
//         console.error("Error fetching PROPERTIES: ", err);
//         return [];
//     }
// }

async function searchProperties(location, propertyType, minPrice, maxPrice) {
    // simulate API delay for realistic testing
    await new Promise((resolve) => setTimeout(resolve, 500));

    const searchCriteria = {
        location,
        propertyType,
        minPrice,
        maxPrice,
    };
    return filterProperties(testProperties, searchCriteria);
}

function displayProperties(properties) {
    const propertyGrid = document.querySelector("#propertyGrid");
    propertyGrid.innerHTML = "";

    properties.forEach((property) => {
        const card = document.createElement("div");
        card.className = "card property-card";
        // <img src="/api/placeholder/250/200" alt="Property Image">
        card.innerHTML = `
            <img src="./images/reiHouse.webp" width="250" alt="Property Image">
            <div class="property-info">
                <h3>${property.streetLine.value}, ${property.city}</h3>
                <p class="property-price">$${property.price.value.toLocaleString()}</p>
                <p>${property.beds} beds | ${property.baths} baths | ${
            property.sqFt.value
        } sqft</p>
            </div>`;

        card.addEventListener("click", () => {
            const modal = initializePropertyModal(property);
            modal.showModal();
        });

        propertyGrid.appendChild(card);
    });
}

// document.querySelector("#searchForm").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const location = document.querySelector("#location").value;
//     const propertyType = document.querySelector("#propertyType").value;
//     const minPrice = document.querySelector("#minPrice").value;
//     const maxPrice = document.querySelector("#maxPrice").value;

//     const properties = await searchProperties(
//         location,
//         propertyType,
//         minPrice,
//         maxPrice
//     );
//     displayProperties(propertyies);
// });

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector("#searchForm");

    if (searchForm) {
        searchForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const location = document.querySelector("#location").value;
            const propertyType = document.querySelector("#propertyType").value;
            const minPrice = document.querySelector("#minPrice").value;
            const maxPrice = document.querySelector("#maxPrice").value;

            try {
                const properties = await searchProperties(
                    location,
                    propertyType,
                    minPrice,
                    maxPrice
                );
                displayProperties(properties);
            } catch (err) {
                console.error("Error searching PROPs: ", err);
                const propertyGrid = document.querySelector("#propertyGrid");
                propertyGrid.innerHTML =
                    "<p>An error occurred while searching for properties. Please try again.</p>";
            }
        });
    }
});

function initializePropertyModal(property) {
    const modal = document.querySelector(".property-modal");

    // initialize prop details
    modal.querySelector(".modal-title").textContent = property.streetLine.value;
    modal.querySelector(
        ".property-price"
    ).textContent = `$${property.price.value.toLocaleString()}`;
    modal.querySelector(".property-specs").textContent = `${
        property.beds
    } beds | ${
        property.baths
    } baths | ${property.sqFt.value.toLocaleString()} sqft`;
    modal.querySelector(
        ".property-location"
    ).textContent = `${property.city}, ${property.state} ${property.zip}`;

    // set default calc values
    const downPayment = property.price.value * 0.2;
    const propertyTax = property.price.value * 0.125;
    const maintenance = property.price.value * 0.01;

    modal.querySelector("#downPayment").value = downPayment.toFixed(0);
    modal.querySelector("#propertyTax").value = propertyTax.toFixed(0);
    modal.querySelector("#maintenance").value = maintenance.toFixed(0);

    // close button handler
    // Close button handler
    modal.querySelector(".close-btn").addEventListener("click", () => {
        modal.close();
    });

    // Toggle advanced options
    const toggleBtn = modal.querySelector(".toggle-advanced");
    const advancedOptions = modal.querySelector(".advanced-options");
    toggleBtn.addEventListener("click", () => {
        advancedOptions.classList.toggle("hidden");
        toggleBtn.textContent = advancedOptions.classList.contains("hidden")
            ? "Show Advanced Options"
            : "Hide Advanced Options";
    });

    // Calculate and update results
    function calculateResults() {
        const values = {
            downPayment:
                parseFloat(modal.querySelector("#downPayment").value) || 0,
            interestRate:
                parseFloat(modal.querySelector("#interestRate").value) || 0,
            monthlyRent:
                parseFloat(modal.querySelector("#monthlyRent").value) || 0,
            propertyTax:
                parseFloat(modal.querySelector("#propertyTax").value) || 0,
            insurance: parseFloat(modal.querySelector("#insurance").value) || 0,
            maintenance:
                parseFloat(modal.querySelector("#maintenance").value) || 0,
        };

        // Mortgage calculation
        const loanAmount = property.price.value - values.downPayment;
        const monthlyRate = values.interestRate / 100 / 12;
        const numberOfPayments = 30 * 12;

        const monthlyMortgage =
            (loanAmount *
                (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        // Monthly expenses
        const monthlyExpenses =
            monthlyMortgage +
            values.propertyTax / 12 +
            values.insurance / 12 +
            values.maintenance / 12;

        // Cash flow and ROI
        const monthlyCashFlow = values.monthlyRent - monthlyExpenses;
        const annualCashFlow = monthlyCashFlow * 12;
        const cashOnCashROI = (annualCashFlow / values.downPayment) * 100;

        // Update results display
        modal.querySelector("#mortgageResult").textContent =
            monthlyMortgage.toFixed(2);
        modal.querySelector("#expensesResult").textContent =
            monthlyExpenses.toFixed(2);
        modal.querySelector("#cashFlowResult").textContent =
            monthlyCashFlow.toFixed(2);
        modal.querySelector("#roiResult").textContent =
            cashOnCashROI.toFixed(2);
    }

    // Add input event listeners
    modal.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", calculateResults);
    });

    // Initial calculation
    calculateResults();

    return modal;
}
