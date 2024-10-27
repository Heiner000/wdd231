// DOM elements
const searchForm = document.querySelector(".search-bar");
const searchInput = document.querySelector(".search-bar input");
let searchTimeout;

// initialize search functionality
function initializeSearch() {
    if (!searchForm || !searchInput) {
        console.warn("Search form elements not found");
        return;
    }

    searchForm.addEventListener("submit", handleSearch);
    searchInput.addEventListener("input", handleSearchInput);

    // restore last search if available
    restoreLastSearch();
}

// handle search form submission
function handleSearch(e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        // store search term in local storage
        const searchParams = {
            location: searchTerm,
            propertyType: "",
            minPrice: "",
            maxPrice: "",
        };

        // store search data
        localStorage.setItem("lastSearch", JSON.stringify(searchParams));
        saveRecentSearch(searchTerm);

        // redirect to property search page w/ location parameter
        window.location.href = `property-search.html`;
    }
}

// handle search input w/ debouncing
function handleSearchInput(e) {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.trim();
        if (searchTerm.length >= 3) {
            localStorage.setItem("lastPartialSearch", searchTerm);
        }
    }, 500);
}

// save recent searches to localStorage
function saveRecentSearch(searchTerm) {
    const recentSearches = getRecentSearches();

    // add a new search to beginning of array
    recentSearches.unshift(searchTerm);

    // keep only the most recent 5 unique searches
    const updatedSearches = [...new Set(recentSearches)].slice(0, 5);

    try {
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    } catch (err) {
        console.warn("failed to save recent searches: ", err);
    }
}

// get recent searches from localStorage
function getRecentSearches() {
    try {
        const searches = localStorage.getItem("recentSearches");
        return searches ? JSON.parse(searches) : [];
    } catch (err) {
        console.warn("Failed to retrieve recent searches: ", err);
        return [];
    }
}

// restore last search term
function restoreLastSearch() {
    try {
        const lastSearch = localStorage.getItem("lastSearch");
        if (lastSearch && searchInput) {
            const { location } = JSON.parse(lastSearch);
            searchInput.value = location || "";
        }
    } catch (err) {
        console.warn("Failed to restore last search: ", err);
    }
}

// check if localStorage is available
function isLocalStorageAvailable() {
    try {
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
        return true;
    } catch (e) {
        console.warn("localStorage is not available: ", e);
        return false;
    }
}

function init() {
    if (!isLocalStorageAvailable()) {
        console.warn(
            "Local storage is not available. Recent searches will not be saved."
        );
        return;
    }

    initializeSearch();
}

// intialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);

// cleanup & remove event listeners
function cleanup() {
    if (searchForm && searchInput) {
        searchForm.removeEventListener("subtmit", handleSearch);
        searchInput.removeEventListener("input", handleSearchInput);
    }
}
