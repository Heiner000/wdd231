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
        card.className = "card";
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
