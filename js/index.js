// 1- loading a common city
window.addEventListener('load', function(){
    getWeather('Cairo');
});

// 2- Getting user location
async function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log("Geolocation is not supported by your browser.");
    }

    async function success(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=61179e78d96547d28e694644253110&q=${lat},${lon}&days=3`);
        const weatherData = await response.json();

        const nextDays = weatherData.forecast.forecastday.slice(1);

        displayTodayWeather(weatherData);
        displayNextDays(nextDays);
    }

    function error(err) {
        console.log("Error getting location:", err);
        getWeather("Cairo");
    }
}

getUserLocation();

// 4- User search for a city
let searchInput = document.querySelector('#searchInput');
let submitInput = document.querySelector('#submitInput');

searchInput.addEventListener('input', function () {
    getWeather(searchInput.value);
});

async function getWeather(country) {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=61179e78d96547d28e694644253110&q=${country}&days=3`);
    const weatherData = await response.json();

    const nextDays = weatherData.forecast.forecastday.slice(1);

    displayTodayWeather(weatherData);
    displayNextDays(nextDays);
}

function getDate(localTime) {
    const date = new Date(localTime);

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });

    return { dayName, dayMonth: `${day} ${month}` };
}

function displayTodayWeather(weatherData) {
    const city = weatherData.location.name;
    const temp = weatherData.current.temp_c;
    const icon = weatherData.current.condition.icon;
    const condition = weatherData.current.condition.text;
    const humidity = weatherData.current.humidity;
    const windSpeed = weatherData.current.wind_kph;
    const windDir = weatherData.current.wind_dir;
    const localTime = weatherData.location.localtime;

    const date = getDate(localTime);

    const cartona = `<div class="forcast-header d-flex justify-content-between" id="today">
                        <div class="day">${date.dayName}</div>
                        <div class=" date">${date.dayMonth}</div>
                    </div>

                    <div class="forcast-content">
                        <div class="location">${city}</div>

                        <div class="degree">
                            <div class="num">${temp}<sup>o</sup>C</div>
                            <div class="forecast-icon">
                                <img src="https:${icon}" alt="" />
                            </div>
                        </div>

                        <div class="custom mb-3">${condition}</div>
                        <span><img src="https://routeweather.netlify.app/images/icon-umberella@2x.png" alt="" width="21"
                                height="21"> ${humidity}% </span>
                        <span class="ms-3"><img src="https://routeweather.netlify.app/images/icon-wind@2x.png" alt=""
                                width="23" height="21"> ${windSpeed}km/h </span>
                        <span class="ms-3"><img src="https://routeweather.netlify.app/images/icon-compass@2x.png" alt=""
                                width="21" height="21"> ${windDir} </span>
                    </div>`;

    document.querySelector('.today').innerHTML = cartona;
}

function displayNextDays(nextDays) {
    let cartona = ``;
    for (let i = 0; i < nextDays.length; i++) {

        const dayName = new Date(nextDays[i].date).toLocaleDateString('en-US', { weekday: 'long' });
        const icon = nextDays[i].day.condition.icon;
        const maxTemp = nextDays[i].day.maxtemp_c;
        const minTemp = nextDays[i].day.mintemp_c;
        const condition = nextDays[i].day.condition.text;

        if (i == 1) {
            cartona = ` <div class="forcast-header d-flex justify-content-center" id="today">
                        <div class="day">${dayName}</div>
                    </div>
                    <div class="forcast-content text-center">
                        <div class="forecast-icon mb-3">
                            <img src="http:${icon}" alt="" />
                        </div>

                        <div class="degree">
                            <div class="num">${maxTemp}<sup>o</sup>C</div>
                        </div>

                        <small>${minTemp}<sup>o</sup></small>

                        <div class="custom mb-3 mt-3">${condition}</div>
                    </div>`
            document.querySelector('.secNextDay').innerHTML = cartona;

        }
        else {
            cartona = ` <div class="forcast-header d-flex justify-content-center forcast-header-darker" id="today">
                        <div class="day">${dayName}</div>
                    </div>
                    <div class="forcast-content bg-darker text-center">
                        <div class="forecast-icon mb-3">
                            <img src="http:${icon}" alt="" />
                        </div>

                        <div class="degree">
                            <div class="num">${maxTemp}<sup>o</sup>C</div>
                        </div>

                        <small>${minTemp}<sup>o</sup></small>

                        <div class="custom mb-3 mt-3">${condition}</div>
                    </div>`
            document.querySelector('.firstNextDay').innerHTML = cartona;
        }
    }
}