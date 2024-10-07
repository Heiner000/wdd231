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

// OpenWeatherMap API
const currentTemp = document.querySelector("#current-temp");
const icon = document.querySelector("#weather-icon");
const desc = document.querySelector("#weather-desc");
const forecast = document.querySelector("#forecast");
const apiKey = "8d6c1caf1bcfa50022aec142f8815c86";

const lat = 33.45;
const lon = -112.12;

const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=24&appid=${apiKey}&units=imperial`;

async function apiCurrentFetch() {
    try {
        const response = await fetch(currentUrl);
        if (!response.ok) {
            throw Error(await response.text());
        } else {
            const data = await response.json();
            console.log(data);
            displayResults(data);
        }
    } catch (err) {
        console.error("Error fetching current weather: ", err);
    }
}

async function apiForecastFetch() {
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) {
            throw Error(await response.text());
        } else {
            const data = await response.json();
            console.log(data);
            displayForecast(data.list);
        }
    } catch (err) {
        console.error("Error fetching weather forecast: ", err);
    }
}

function displayResults(data) {
    currentTemp.innerHTML = `${data.main.temp}&degF`;
    const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    let weatherDesc = data.weather[0].description;
    icon.setAttribute("src", iconsrc);
    icon.setAttribute("alt", desc);
    desc.innerHTML = `${weatherDesc}`;
}

function displayForecast(data) {
    const days = ["dayOne", "dayTwo", "dayThree"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let uniqueDays = [];
    let dayIndex = 0;

    for (let forecast of data) {
        const forecastDate = new Date(forecast.dt * 1000);
        forecastDate.setHours(0, 0, 0, 0);

        // skip todays forecasts
        if (forecastDate.getTime() === today.getTime()) {
            continue;
        }

        // double check for unique days
        if (
            !uniqueDays.some((day) => day.getTime() === forecastDate.getTime())
        ) {
            uniqueDays.push(forecastDate);

            const dayElement = document.querySelector(`#${days[dayIndex]}`);
            if (dayElement) {
                dayElement.innerHTML = `
                <p><strong>${forecastDate.toLocaleDateString("en-US", {
                    weekday: "short",
                })}</strong>: ${forecast.main.temp.toFixed(1)}&degF</p>`;
                dayIndex++;
            }

            // break out after we find 3 unique days
            if (uniqueDays.length === 3) {
                break;
            }
        }
    }
}

apiCurrentFetch();
apiForecastFetch();
