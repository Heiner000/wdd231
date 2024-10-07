const currentTemp = document.querySelector("#current-temp");
const icon = document.querySelector("#weather-icon");
const caption = document.querySelector("figcaption");

const apiKey = "8d6c1caf1bcfa50022aec142f8815c86";

const lat = 49.75;
const lon = 6.64;

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

async function apiFetch() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw Error(await response.text());
        } else {
            const data = await response.json();
            // console.log(data);
            displayResults(data);
        }
    } catch (err) {
        console.error("Error fetching weather: ", err);
    }
}

function displayResults(data) {
    currentTemp.innerHTML = `${data.main.temp}&degF`;
    const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    let desc = data.weather[0].description;
    icon.setAttribute("src", iconsrc);
    icon.setAttribute("alt", desc);
    caption.textContent = `${desc}`;
}

apiFetch();
