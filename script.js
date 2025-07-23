const apiKey = "df2e221afff2f024e9dde4f3f596efda";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const aqiKey = "f6197f03ec09f9ab2aee16e6e38939be";
const aqi_url = "http://api.openweathermap.org/data/2.5/air_pollution?";

const btn = document.getElementById('search-btn');
const forcastContainer = document.querySelector(".forecast-cards");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const getDate = () => {
    const d = new Date();
    let day = days[d.getDay()];
    let month = months[d.getMonth()];
    let date = d.getDate();
    let year = d.getFullYear();

    let fulldate = document.getElementById('date');
    fulldate.innerHTML = `${day}, ${month} ${date} ${year}`;
    
}

const getTemperature = async()=>{
    let city = document.querySelector(".search-container input").value;
    let cityName = document.querySelector("#city-name");
    let temp = document.querySelector("#temp");
    let description = document.querySelector("#description");
    let wind = document.querySelector("#wind");
    let humidity = document.querySelector("#humidity");
    let weather = document.querySelector("#weather");
    let aqi = document.querySelector("#aqi");

    if(city === ""){
        city = "New York";   
    }
    
    try{

        const url = `${BASE_URL}&q=${city}&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        
        temp.innerText = Math.round(data.main.temp) + "°C";
        description.innerText = data.weather[0].description;
        wind.innerText = data.wind.speed+" mi/h";
        humidity.innerText = data.main.humidity + "%";
        weather.innerText = data.weather[0].main;
        cityName.innerText = data.name;

        let lat = data.coord.lat;
        let lon = data.coord.lon;

        const aqiurl = `${aqi_url}lat=${lat}&lon=${lon}&appid=${aqiKey}`;
        const api_response = await fetch(aqiurl);
        const api_data = await api_response.json();
        let aqidata = api_data.list[0].main.aqi;

        if(aqidata == 1){
            aqi.innerText = "Good"
        }
        else if(aqidata == 2){
            aqi.innerText = "Fair"
        }
        else if(aqidata == 3){
            aqi.innerText = "Moderate"
        }
        else if(aqidata == 4){
            aqi.innerText = "Poor"
        }
        else if(aqidata == 5){
            aqi.innerText = "Very Poor"
        }
    }
    catch(err){
        alert("City does not found!!");
    }
    
    updateForecastInfo(city);
    
}

const updateForecastInfo = async(city)=>{
    // const url = `${BASE_URL}&q=${city}&appid=${apiKey}`;
    const BASE_URL = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apiKey}`;
    const fetchData = await fetch(BASE_URL);
    const data = await fetchData.json();

    const timeTaken = '00:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forcastContainer.innerHTML = '';

    data.list.forEach((forecastWeather) => {
        if(forecastWeather.dt_txt.includes(timeTaken)){
            
            updateForecastItem(forecastWeather);
            
        }   
    })
}

const updateForecastItem = (weatherData)=>{
    const {
        dt_txt : date,
        main : {temp}
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day : '2-digit',
        month : 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);
    
    const forecastItem = `
        <div class="day">
            <p class="forecast-day">${dateResult}</p>
            <p class="forecast-temp">${Math.round(temp)} °C</p>
        </div>`

    forcastContainer.insertAdjacentHTML('beforeend', forecastItem);
    
}

btn.addEventListener("click", (evt)=>{
    evt.preventDefault();
    getTemperature();  
    getDate();
})

window.addEventListener("load", ()=>{
    getTemperature();
    getDate();
})
