import {
  COUNTRY_API,
  WEATHER_API,
  WAETHER_API_METRICS,
  WAETHER_API_DAILY,
  POSITION_API,
} from "./config";
import { getJSON, getPosition } from "./helper";

// Model state
export const state = {
  city: {},
  weather: {
    hourly: [],
    currentTemp: {},
    metrics: [],
    daily: [],
    units: [],
    currentDay: "",
  },
  bookmarks: [],
};

/**
 *  Get city coordinates and it's country name.
 * @param {undefined | string} cityName
 * @returns none
 */
export const loadCity = async function (cityName) {
  try {
    const { results } = await getJSON(`${COUNTRY_API}${cityName}`);

    state.city = {
      name: results[0].name,
      country: results[0].country,
      latitude: results[0].latitude,
      longitude: results[0].longitude,
      timezone: results[0].timezone,
    };

    state.city.bookmarked = checkBookmark({
      name: state.city.name,
      country: state.city.country,
    });
  } catch (error) {
    throw new Error(`No search results found! Inavlid City`);
  }
};

/**
 * Set 7-days hourly forecast from loaded forecast data.
 * @param {Object} data: Forecast data
 * @returns none
 */
const setHourlyForecast = function (data) {
  const {
    time,
    temperature_2m: temps,
    weather_code: weatherCode,
  } = data.hourly;

  state.weather.hourly = temps.map((temp, i) => {
    let day = new Intl.DateTimeFormat(navigator.language, {
      weekday: "long",
    }).format(new Date(time[i]));

    return {
      day: day,
      temperature: temp,
      time: time[i],
      weatherCode: weatherCode[i],
    };
  });
};

/**
 * Set weather metrics (Day's feels like - Humidity - wind speed - precipitation),
 * it's units and current day and it's temperature.
 * @param {Object} data : Forecast data.
 * @returns none
 */
const setWeatherMetrics = function (data) {
  const { current: metrics, current_units: units } = data;

  state.weather.metrics = [
    { feelsLike: metrics.apparent_temperature },
    { humidity: metrics.relative_humidity_2m },
    { wind: metrics.wind_speed_10m },
    { precipitation: metrics.precipitation },
  ];

  state.weather.isDay = metrics.is_day;
  state.weather.units = [
    { feelsLike: units.apparent_temperature },
    { humidity: units.relative_humidity_2m },
    { wind: units.wind_speed_10m },
    { precipitation: units.precipitation },
    { time: units.time },
    { temperature: units.temperature_2m },
  ];

  state.weather.currentTemp = {
    time: metrics.time,
    temperature: metrics.temperature_2m,
  };

  state.weather.currentDay = new Intl.DateTimeFormat(navigator.language, {
    weekday: "long",
  }).format(new Date(metrics.time));
};

/**
 * Load and set forecast data of current city
 * @param {Object} units : {temperture - precipitation - wind speed} units.
 * @returns none
 */
export const loadForecast = async function ({
  temperature,
  precipitation,
  windSpeed,
}) {
  try {
    const data = await getJSON(
      `${WEATHER_API}latitude=${state.city.latitude}&longitude=${state.city.longitude}${WAETHER_API_METRICS}&temperature_unit=${temperature}&wind_speed_unit=${windSpeed}&precipitation_unit=${precipitation}`
    );

    // Set Hourly Forecast of current day
    setHourlyForecast(data);

    //  Set Weather Metrics
    setWeatherMetrics(data);
  } catch (error) {
    throw error;
  }
};

/**
 * Load and set 7-days forecast temperature.
 * @param {string } [unit="celsius" ] Unit of loaded temperatures.
 * @returns none
 */
export const loadDailyForecast = async function (unit = "celsius") {
  try {
    const {
      daily: {
        temperature_2m_max: maxTemp,
        temperature_2m_min: minTemp,
        time,
        weather_code: weatherCode,
      },
    } = await getJSON(
      `${WEATHER_API}latitude=${state.city.latitude}&longitude=${state.city.longitude}${WAETHER_API_DAILY}&temperature_unit=${unit}`
    );

    state.weather.daily = maxTemp.map((value, i) => {
      return {
        max: value,
        min: minTemp[i],
        time: time[i],
        code: weatherCode[i],
      };
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get hourly temperature of certain day
 * @param {string} [day = currentDay] selected day to display hourly forecast.
 * @returns {Array} Hourly forecast of day
 */
export const getHoulryDayWeather = function (day = state.weather.currentDay) {
  return state.weather.hourly.filter(
    (hour) => hour.day.toLowerCase() === day.toLowerCase()
  );
};

/**
 * Load and Update precipitation of weather with certain unit.
 * @param {string} unit Unit of precipitation
 * @returns none
 */
export const loadPrecipitaion = async function (unit) {
  try {
    const data = await getJSON(
      `${WEATHER_API}latitude=${state.city.latitude}&longitude=${state.city.longitude}&current=precipitation&precipitation_unit=${unit}`
    );

    state.weather.metrics = state.weather.metrics.map((metric) =>
      metric["precipitation"]
        ? { precipitation: data.current.precipitation }
        : metric
    );
    state.weather.units = state.weather.units.map((unit) =>
      unit["precipitation"]
        ? { precipitation: data.current_units.precipitation }
        : unit
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Get precipitation current value and unit from model state.
 * @returns {Object} precipitation
 */
export const getPreciptation = function () {
  return {
    value: state.weather.metrics.at(-1).precipitation,
    unit: state.weather.units[3].precipitation,
  };
};

/**
 * Load and Update wind speed of weather with certain unit.
 * @param {string} unit Unit of wind speed
 * @returns none
 */
export const loadWindSpeed = async function (unit) {
  try {
    const data = await getJSON(
      `${WEATHER_API}latitude=${state.city.latitude}&longitude=${state.city.longitude}&current=wind_speed_10m&wind_speed_unit=${unit}`
    );
    state.weather.metrics = state.weather.metrics.map((metric) =>
      metric["wind"] ? { wind: data.current.wind_speed_10m } : metric
    );
    state.weather.units = state.weather.units.map((unit) =>
      unit["wind"] ? { wind: data.current_units.wind_speed_10m } : unit
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Get Wind current value and unit from model state.
 * @returns {Object} wind speed
 */
export const getWindSpeed = function () {
  return {
    value: state.weather.metrics[2].wind,
    unit: state.weather.units[2].wind,
  };
};

/**
 * Get user current position.
 */
export const loadUserLocation = async function () {
  try {
    const location = await getPosition();

    state.city.latitude = location.coords.latitude;
    state.city.longitude = location.coords.longitude;

    const country = await getJSON(
      `${POSITION_API}latitude=${state.city.latitude}&longitude=${state.city.longitude}`
    );

    state.city.name = country.city;
    state.city.country = country.countryName;
    state.city.bookmarked = checkBookmark({
      name: state.city.name,
      country: state.city.country,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update bookmarks based on bookmark state of city.
 * @param {Object} bookmarkedCity
 * @returns none
 */
export const updateBookmark = function (bookmarkedCity) {
  const isBookmarked = state.city.bookmarked;
  if (!isBookmarked) addBookmark(bookmarkedCity);
  else removeBookmark(bookmarkedCity);
};

/**
 * Add city to bookmarks, marked as a bookmarked and update storage.
 * @param {Object} bookmarkedCity
 * @returns none
 */
const addBookmark = function (bookmarkedCity) {
  state.bookmarks.push(bookmarkedCity);
  state.city.bookmarked = true;
  setStorage();
};

/**
 * Remove city from bookmarks, marked as un-bookmarked and update storge.
 * @param {Object} bookmarkedCity
 * @returns none
 */
const removeBookmark = function (bookmarkedCity) {
  const bookmarkIndex = state.bookmarks.findIndex(
    (bookmark) =>
      bookmark.name === bookmarkedCity.name &&
      bookmark.country === bookmarkedCity.country
  );
  state.bookmarks.splice(bookmarkIndex, 1);
  state.city.bookmarked = false;

  setStorage();
};

/**
 * Set localstorage with bookmarks.
 */
const setStorage = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

/**
 * Get bookmarks from localstorage
 * @returns none
 */
const getStorage = function () {
  const data = JSON.parse(localStorage.getItem("bookmarks"));
  if (!data) return;
  state.bookmarks = data.map((bookmark) => bookmark);
};

/**
 * Check if city already exist in bookmarks or not.
 * @param {Object} city
 * @returns {Boolean} exist=true - not exist=false
 */
const checkBookmark = function (city) {
  const isBookmarked = state.bookmarks.some(
    (bookmark) =>
      bookmark.name === city.name && bookmark.country === city.country
  );

  if (isBookmarked) return true;
  return false;
};

getStorage();
