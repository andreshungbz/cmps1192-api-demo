// Functions

const fetchIPAddress = async () => {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
};

const fetchLocation = async (ip, key) => {
  const response = await fetch(
    `https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/?ip=${ip}`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'ip-geolocation-ipwhois-io.p.rapidapi.com',
        'x-rapidapi-key': key,
      },
    }
  );
  const data = await response.json();
  return data;
};

const fetchWeather = async (city, key) => {
  const response = await fetch(
    `https://community-open-weather-map.p.rapidapi.com/find?q=${city}&units=imperial`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
        'x-rapidapi-key': key,
      },
    }
  );
  const data = await response.json();
  return data;
};

const fetchJoke = async () => {
  const response = await fetch(
    'https://official-joke-api.appspot.com/random_joke'
  );
  const data = await response.json();
  return data;
};

const fetchDemographic = async (name) => {
  return {
    age: await fetch(`https://api.agify.io?name=${name}`).then((response) =>
      response.json()
    ),
    gender: await fetch(`https://api.genderize.io?name=${name}`).then(
      (response) => response.json()
    ),
    nationality: await fetch(`https://api.nationalize.io?name=${name}`).then(
      (response) => response.json()
    ),
  };
};

// Main Program

const main = async () => {
  const rapidAPIKey = '';

  // IP Address

  const ipAddress = await fetchIPAddress(); // ip string

  const ip = document.querySelector('#ipaddress');
  ip.textContent = ipAddress;

  // Location

  const locationInfo = await fetchLocation(ipAddress, CONFIG.RAPIDAPI_KEY); // location object

  const countryFlag = document.querySelector('#countryflag');
  countryFlag.setAttribute('src', locationInfo.country_flag);
  const country = document.querySelector('#country');
  country.textContent = locationInfo.country;
  const city = document.querySelector('#city');
  city.textContent = locationInfo.city;
  const region = document.querySelector('#region');
  region.textContent = locationInfo.region;

  // Weather

  const weatherInfo = await fetchWeather(
    locationInfo.city,
    CONFIG.RAPIDAPI_KEY
  ); // weather object

  const weatherIcon = document.querySelector('#weather_icon');
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/wn/${weatherInfo.list[0].weather[0].icon}.png`
  );
  const weather = document.querySelector('#weather');
  weather.textContent = weatherInfo.list[0].weather[0].description;
  const temp = document.querySelector('#temp');
  temp.textContent = weatherInfo.list[0].main.temp;
  const feelsLike = document.querySelector('#feels_like');
  feelsLike.textContent = weatherInfo.list[0].main.feels_like;

  // Joke

  const jokeInfo = await fetchJoke(); // joke object

  const setup = document.querySelector('#setup');
  setup.textContent = jokeInfo.setup;
  const punchline = document.querySelector('#punchline');
  punchline.textContent = jokeInfo.punchline;

  // Demographic

  const formInput = document.querySelector('input[type="text"]');
  const formSubmit = document.querySelector('input[type="submit"]');
  const name = document.querySelector('#name');
  const age = document.querySelector('#age');
  const gender = document.querySelector('#gender');
  const nationality = document.querySelector('#nationality');

  formSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    const demographicInfo = await fetchDemographic(formInput.value);
    console.log(demographicInfo);

    name.textContent = formInput.value;
    age.textContent = demographicInfo.age.age;
    gender.textContent = demographicInfo.gender.gender;
    nationality.textContent = demographicInfo.nationality.country[0].country_id;
  });
};

main();
