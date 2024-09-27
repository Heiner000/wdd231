const url =
    "https://brotherblazzard.github.io/canvas-content/latter-day-prophets.json";

// const cards = document.querySelector("#cards");
// button elements
const all = document.querySelector("#all");
const utah = document.querySelector("#utah");
const foreign = document.querySelector("#foreign");
const old = document.querySelector("#old");
const children = document.querySelector("#children");
const tenure = document.querySelector("#tenure");

const getProphets = async (filter = "all") => {
    let prophets = await getProphetData(url);
    switch (filter) {
        case "utah":
            prophets = prophets.filter(
                (prophet) => prophet.birthplace === "Utah"
            );
            break;
        case "foreign":
            prophets = prophets.filter(
                (prophet) => prophet.birthplace === "England"
            );
            break;
        case "tenure":
            prophets = prophets.filter((prophet) => prophet.length >= 15);
            break;
        case "childl":
            prophets = prophets.filter(
                (prophet) => prophet.numofchildren >= 10
            );
            break;
        case "old":
            prophets = prophets.filter(
                (prophet) =>
                    getAgeAtDeathInYears(prophet.birthdate, prophet.death) >= 95
            );
            break;
        default:
            break;
    }
    displayProphets(prophets);
};

async function getProphetData(url) {
    const response = await fetch(url);
    const data = await response.json();
    // console.table(data.prophets);
    return data.prophets;
}

const displayProphets = (prophets) => {
    const cards = document.querySelector("#cards");
    cards.innerHTML = "";

    prophets.forEach((prophet) => {
        let card = document.createElement("section");
        let fullName = document.createElement("h2");
        let portrait = document.createElement("img");
        let date = document.createElement("p");
        let place = document.createElement("p");

        fullName.textContent = `${prophet.name} ${prophet.lastname}`;

        portrait.setAttribute("src", prophet.imageurl);
        portrait.setAttribute(
            "alt",
            `Portrait of ${prophet.name} ${prophet.lastname} - Prophet #${prophet.order}`
        );
        portrait.setAttribute("loading", "lazy");
        portrait.setAttribute("width", "340");
        portrait.setAttribute("height", "440");

        date.innerHTML = `Birthdate: ${prophet.birthdate}`;
        place.innerHTML = `Birth Place: ${prophet.birthplace}`;

        card.appendChild(fullName);
        card.appendChild(date);
        card.appendChild(place);
        card.appendChild(portrait);

        cards.appendChild(card);
    });
};

getProphets();
// getProphetData(url);

// buttons
all.addEventListener("click", () => {
    clearButtonClasses();
    getProphets("all");
    all.classList.add("active");
});

utah.addEventListener("click", () => {
    clearButtonClasses();
    getProphets("utah");
    utah.classList.add("active");
});

document.querySelector("#foreign").addEventListener("click", () => {
    clearButtonClasses();
    getProphets("foreign");
    foreign.classList.add("active");
});

tenure.addEventListener("click", () => {
    clearButtonClasses();
    getProphets("tenure");
    tenure.classList.add("active");
});

children.addEventListener("click", () => {
    clearButtonClasses();
    getProphets("children");
    children.classList.add("active");
});

old.addEventListener("click", () => {
    clearButtonClasses();
    getProphets("old");
    old.classList.add("active");
});

function getAgeAtDeathInYears(birthdate, deathdate) {
    let birth = new Date(birthdate);
    let death = new Date(deathdate);
    if (deathdate === null) {
        death = new Date();
    }
    return Math.floor((death - birth) / (365 * 24 * 60 * 60 * 1000));
}

function clearButtonClasses() {
    filterbuttons = document.querySelectorAll("button");
    filterbuttons.forEach((button) => (button.className = ""));
}
