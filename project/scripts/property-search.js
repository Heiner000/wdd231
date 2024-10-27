// API configuration
const API_KEY = "f7db5b75famsh65136834d13274cp16bae2jsn988d52cac8a9";
const API_HOST = "redfin-com-data.p.rapidapi.com";

// * cache management for property data

const PropertyCache = {
    // cache duration in millisseconds (60 minutes)
    CACHE_DURATION: 60 * 60 * 1000,

    // generate a cache key from search parameters
    generateKey(params) {
        return `prop_search_${Object.values(params).join("_")}`;
    },

    // check if cache entry is still valid
    isValid(cacheEntry) {
        if (!cacheEntry) return false;
        const now = new Date().getTime();
        return now - cacheEntry.timestamp < this.CACHE_DURATION;
    },

    // store property data in cache
    store(key, data) {
        const cacheEntry = {
            data,
            timestamp: new Date().getTime(),
        };
        try {
            localStorage.setItem(key, JSON.stringify(cacheEntry));
        } catch (e) {
            this.clearOldEntries(); // if storage full, clear old entries
            try {
                localStorage.setItem(key, JSON.stringify(cacheEntry));
            } catch (e) {
                console.warn("Failed to store in cache:", e);
            }
        }
    },

    // retrieve property data from cache
    retrieve(key) {
        try {
            const cacheEntry = JSON.parse(localStorage.getItem(key));
            return this.isValid(cacheEntry) ? cacheEntry.data : null;
        } catch (e) {
            return null;
        }
    },

    // clear expired cache entries
    clearOldEntries() {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("prop_search_")) {
                try {
                    const cacheEntry = JSON.parse(localStorage.getItem(key));
                    if (!this.isValid(cacheEntry)) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    localStorage.removeItem(key);
                }
            }
        });
    },

    // store last search parameters
    storeLastSearch(params) {
        localStorage.setItem("lastSearch", JSON.stringify(params));
    },
};

// * search properties using cache or API
async function searchProperties(location, propertyType, minPrice, maxPrice) {
    const searchParams = {
        location,
        propertyType,
        minPrice,
        maxPrice,
    };

    // generate cache key for this search
    const cacheKey = PropertyCache.generateKey(searchParams);

    // try to get data from cache first
    const cachedData = PropertyCache.retrieve(cacheKey);
    if (cachedData) {
        console.log("Loading properties from cache...");
        return cachedData;
    }

    // if not in cache, fetch from API
    console.log("Fetching properties from API");
    const url = new URL(`https://${API_HOST}/property/search`);
    url.searchParams.append("location", location);

    if (propertyType) url.searchParams.append("home_type", propertyType);
    if (minPrice) url.searchParams.append("min_price", minPrice);
    if (maxPrice) url.searchParams.append("max_price", maxPrice);

    const options = {
        method: "GET",
        headers: {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST,
        },
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.data?.homes) {
            throw new Error("Invalid API response structure");
        }

        // store the API response in cache
        PropertyCache.store(cacheKey, result.data.homes);
        // ! log the data
        console.log(result.data.homes);
        return result.data.homes;
    } catch (error) {
        console.error("Error fetching properties: ", error);
        throw new Error("Failed to fetch properties. Please try again later.");
    }
}

// * Initialize search form event listener
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector("#searchForm");
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-indicator";

    if (searchForm) {
        searchForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const propertyGrid = document.querySelector("#propertyGrid");
            const resultsSection = document.querySelector(".results-container");

            // update loading text based on cache status
            const location = document.querySelector("#location").value;
            const propertyType = document.querySelector("#propertyType").value;
            const minPrice = document.querySelector("#minPrice").value;
            const maxPrice = document.querySelector("#maxPrice").value;

            const searchParams = { location, propertyType, minPrice, maxPrice };
            const cacheKey = PropertyCache.generateKey(searchParams);

            loadingIndicator.textContent = PropertyCache.retrieve(cacheKey)
                ? "Loading properties from cache..."
                : "Searching properties...";

            propertyGrid.innerHTML = "";
            propertyGrid.appendChild(loadingIndicator);
            scrollToElement(resultsSection);

            try {
                // store search parameters
                PropertyCache.storeLastSearch(searchParams);

                const properties = await searchProperties(
                    location,
                    propertyType,
                    minPrice,
                    maxPrice
                );
                displayProperties(properties);
            } catch (err) {
                propertyGrid.innerHTML = `
                    <div class="error-msg">
                        <p>${err.msg}</p>
                        <button onclick="window.location.reload()">Try Again</button>
                    </div>`;
                scrollToElement(resultsSection);
            }
        });

        // load last search from localStorage
        const lastSearch = localStorage.getItem("lastSearch");
        if (lastSearch) {
            const { location, propertyType, minPrice, maxPrice } =
                JSON.parse(lastSearch);
            document.querySelector("#location").value = location || "";
            document.querySelector("#propertyType").value = propertyType || "";
            document.querySelector("#minPrice").value = minPrice || "";
            document.querySelector("#maxPrice").value = maxPrice || "";
        }

        // clear expired cache entries on page load
        PropertyCache.clearOldEntries();
    }
});

// Smoothly scrolls to an element
//  @param {HTMLElement} element - Element to scroll to

function scrollToElement(element) {
    // Get the header height to offset the scroll position
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;

    // Calculate the element's position relative to the viewport
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight - 20; // 20px additional padding

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
    });
}

// Utility function to get the appropriate image URL for a property
function getPropertyImageUrl(property) {
    // Check for photos.items array first
    if (property.photos?.items?.length > 0) {
        return property.photos.items[0];
    }

    // Fallback to posterFrameUrl if available
    if (property.posterFrameUrl) {
        return property.posterFrameUrl;
    }

    // Default to our local placeholder image
    return "./images/reiHouse.webp";
}

// Display properties in the grid and scroll to results
function displayProperties(properties) {
    const propertyGrid = document.querySelector("#propertyGrid");
    const resultsSection = document.querySelector(".results-container");
    propertyGrid.innerHTML = "";

    if (!properties.length) {
        propertyGrid.innerHTML =
            "<p class='no-results'>No properties found matching your criteria.</p>";
        // Still scroll to results even if none found
        scrollToElement(resultsSection);
        return;
    }

    properties.forEach((property) => {
        // Skip properties with missing required data
        if (!property.streetLine?.value || !property.price?.value) return;

        const card = document.createElement("div");
        card.className = "card property-card";

        const imageUrl = getPropertyImageUrl(property);

        // Add console log for debugging
        console.log(`Property: ${property.streetLine.value}`);
        console.log("Photo URL:", imageUrl);
        console.log("Photos object:", property.photos);

        card.innerHTML = `
            <img src="${imageUrl}" width="250" height="200" alt="Property at ${
            property.streetLine.value
        }" loading="lazy" onerror="this.src='images/reiHouse.webp';">
            <div class="property-info">
                <h3>${property.streetLine.value}, ${property.city}</h3>
                <p class="property-price">$${property.price.value.toLocaleString()}</p>
                <p>${property.beds} beds | ${property.baths} baths | ${
            property.sqFt?.value?.toLocaleString() || "N/A"
        } sqft</p>
            </div>`;

        card.addEventListener("click", () => {
            const modal = initializePropertyModal(property);
            modal.showModal();
        });

        propertyGrid.appendChild(card);
    });

    // Scroll to results after they're displayed
    scrollToElement(resultsSection);
}

// Initialize search form event listener
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector("#searchForm");
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-indicator";
    loadingIndicator.textContent = "Searching properties...";

    if (searchForm) {
        searchForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const propertyGrid = document.querySelector("#propertyGrid");
            const resultsSection = document.querySelector(".results-container");

            // Show loading indicator and scroll to it
            propertyGrid.innerHTML = "";
            propertyGrid.appendChild(loadingIndicator);
            scrollToElement(resultsSection);

            try {
                const location = document.querySelector("#location").value;
                const propertyType =
                    document.querySelector("#propertyType").value;
                const minPrice = document.querySelector("#minPrice").value;
                const maxPrice = document.querySelector("#maxPrice").value;

                // Store search in localStorage
                localStorage.setItem(
                    "lastSearch",
                    JSON.stringify({
                        location,
                        propertyType,
                        minPrice,
                        maxPrice,
                    })
                );

                const properties = await searchProperties(
                    location,
                    propertyType,
                    minPrice,
                    maxPrice
                );
                displayProperties(properties);
            } catch (error) {
                propertyGrid.innerHTML = `
                    <div class="error-message">
                        <p>${error.message}</p>
                        <button onclick="window.location.reload()">Try Again</button>
                    </div>`;
                scrollToElement(resultsSection);
            }
        });

        // Load last search from localStorage
        const lastSearch = localStorage.getItem("lastSearch");
        if (lastSearch) {
            const { location, propertyType, minPrice, maxPrice } =
                JSON.parse(lastSearch);
            document.querySelector("#location").value = location || "";
            document.querySelector("#propertyType").value = propertyType || "";
            document.querySelector("#minPrice").value = minPrice || "";
            document.querySelector("#maxPrice").value = maxPrice || "";
        }
    }
});

function initializePropertyModal(property) {
    const modal = document.querySelector(".property-modal");

    const imageUrl = getPropertyImageUrl(property);

    // initialize prop details
    modal.querySelector(".modal-content").innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${property.streetLine.value}</h2>
            <button class="close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="property-info">
                <img 
                    src="${imageUrl}" 
                    alt="Property at ${property.streetLine.value}"
                    loading="lazy"
                    onerror="this.src='images/reiHouse.webp';"
                >
                <div class="details">
                    <p class="property-price">$${property.price.value.toLocaleString()}</p>
                    <p class="property-specs">${property.beds} beds | ${
        property.baths
    } baths | ${property.sqFt.value.toLocaleString()} sqft</p>
                    <p class="property-location">${property.city}, ${
        property.state
    } ${property.zip}</p>
                </div>
            </div>
            <div class="calculator-section">
                <h3>Investment Calculator</h3>
                <div class="form-group">
                    <label for="downPayment">Down Payment ($)</label>
                    <input type="number" id="downPayment" name="downPayment" value="${(
                        property.price.value * 0.2
                    ).toFixed(0)}">
                </div>
                <div class="form-group">
                    <label for="interestRate">Interest Rate (%)</label>
                    <input type="number" id="interestRate" value="6.5" step="0.1" name="interestRate">
                </div>
                <div class="form-group">
                    <label for="monthlyRent">Expected Monthly Rent ($)</label>
                    <input type="number" id="monthlyRent" name="monthlyRent">
                </div>
                <button class="toggle-advanced">Show Advanced Options</button>
                <div class="advanced-options hidden">
                    <div class="form-group">
                        <label for="propertyTax">Annual Property Tax ($)</label>
                        <input type="number" id="propertyTax" name="propertyTax" value="${(
                            (property.price.value * 0.125) /
                            12
                        ).toFixed(0)}">
                    </div>
                    <div class="form-group">
                        <label for="insurance">Annual Insurance ($)</label>
                        <input type="number" id="insurance" value="1200" name="insurance">
                    </div>
                    <div class="form-group">
                        <label for="maintenance">Annual Maintenance ($)</label>
                        <input type="number" id="maintenance" name="maintenance" value="${(
                            property.price.value * 0.005
                        ).toFixed(0)}">
                    </div>
                </div>
                <div class="calculator-results">
                    <h4>Monthly Breakdown</h4>
                    <p>Mortgage: $<span id="mortgageResult">0</span></p>
                    <p>Total Expenses: $<span id="expensesResult">0</span></p>
                    <p>Cash Flow: $<span id="cashFlowResult">0</span> <span class="indicator"></span></p>
                    <p>Cash on Cash ROI: <span id="roiResult">0</span>% <span class="indicator"></span></p>
                    <p id="investmentMessage" class="investment-message"></p>
                </div>
            </div>
        </div>
    `;

    modal.querySelector(".close-btn").addEventListener("click", () => {
        modal.close();
    });

    const toggleBtn = modal.querySelector(".toggle-advanced");
    const advancedOptions = modal.querySelector(".advanced-options");
    toggleBtn.addEventListener("click", () => {
        advancedOptions.classList.toggle("hidden");
        toggleBtn.textContent = advancedOptions.classList.contains("hidden")
            ? "Show Advanced Options"
            : "Hide Advanced Options";
    });

    function updateIndicators(cashFlow, roi) {
        // get indicator elements
        const cashFlowIndicator =
            modal.querySelector("#cashFlowResult").nextElementSibling;
        const roiIndicator =
            modal.querySelector("#roiResult").nextElementSibling;
        const messageElement = modal.querySelector("#investmentMessage");

        // update cash flow indicator
        cashFlowIndicator.innerHTML =
            cashFlow > 0
                ? "<span class='check'>✓</span>"
                : "<span class='x'>✗</span>";

        // update roi indicator
        roiIndicator.innerHTML =
            roi > 0
                ? "<span class='check'>✓</span>"
                : "<span class='x'>✗</span>";

        // count positive indicators
        const positiveIndicators = (cashFlow > 0 ? 1 : 0) + (roi > 0 ? 1 : 0);

        // update message
        messageElement.textContent =
            positiveIndicators > 0
                ? "This could be a good investment, it bears further research!"
                : "This one won't work with these figures...";
        messageElement.className = `investment-message ${
            positiveIndicators > 0 ? "positive" : "negative"
        }`;
    }

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

        // mortgage calculation
        const loanAmount = property.price.value - values.downPayment;
        const monthlyRate = values.interestRate / 100 / 12;
        const numberOfPayments = 30 * 12;

        const monthlyMortgage =
            (loanAmount *
                (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        // monthly expenses
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

        // update indicators & message
        updateIndicators(monthlyCashFlow, cashOnCashROI);
    }

    // add input event listeners
    modal.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", calculateResults);
    });

    calculateResults();

    return modal;
}
