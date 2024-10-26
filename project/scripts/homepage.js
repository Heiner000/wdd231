const searchForm = document.querySelector(".search-bar");
const searchInput = document.querySelector(".search-bar input");
const searchButton = document.querySelector(".search-bar button");
let searchTimeout;

// initialize search functionality
function initializeSearch() {
    searchForm.addEventListener("subtmit", handleSearch);
    searchInput?.addEventListener("input", handleSearchInput);
}

// handle search form submission
function handleSearch(e) {
    e.preventDefault();
    const searchTerm = searchInput.ariaValueMax.trim();

    if (searchTerm) {
        // store search in local storage
        saveRecentSearch(searchTerm);
        // redirect to property search page w/ query parameter
        window.location.href = `property-search.html?q=${encodeURIComponent(
            searchTerm
        )}`;
    }
}

// handle search input w/ debouncing
function handleSearchInput(e) {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.trim();
        if (searchTerm.length >= 3) {
            // ! call Redfin API
            // ? log the search term temporarily
            console.log(`Searching for ... ${searchTerm}`);
        }
    }, 500);
}

// save recent searches to localStorage
function saveRecentSearch(searchTerm) {
    const recentSearch = getRecentSearches();

    // add a new search to beginning of array
    recentSearches.unshift(searchTerm);

    // keep only the most recent 5 searches
    const updatedSearches = [...new Set(recentSearches)].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
}

// get recent searches from localStorage
function getRecentSearches() {
    const searches = localStorage.getItem("recentSearches");
    return searches ? JSON.parse(searches) : [];
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
    initializeSearch();

    // check for localStorage support
    if (!isLocalStorageAvailable()) {
        console.warn(
            "Local storage is not availale. Recent searches will not be saved."
        );
    }
}

document.addEventListener("DOMContentLoaded", init);
