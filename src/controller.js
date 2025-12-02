import 'core-js';
import 'regenerator-runtime';
import * as model from './model';
import searchbarView from './view/searchbarView';
import cityView from './view/cityView';
import metricsView from './view/metricsView';
import dailyView from './view/dailyView';
import hourlyView from './view/hourlyView';
import settingView from './view/settingView';
import errorView from './view/errorView';
import bookmarksView from './view/bookmarksView';

let units = {
  temperature: 'celsius',
  precipitation: 'mm',
  windSpeed: 'kmh',
};

const controlUserLocation = async function () {
  try {
    // 1. Get user current location.
    await model.loadUserLocation();

    // 2. Get forecast of user location
    await controlCityWeather();
  } catch (error) {
    errorView.render(error);
  }
};

const controlCitySearch = async function (cityName) {
  try {
    // 1. Render Loading state
    cityView.renderLoader();

    // 2. load Country coordinates
    await model.loadCity(cityName);

    // 3. load forecast of inpust city
    await controlCityWeather();
  } catch (error) {
    cityView.render(model.state);
    cityView.setBackground();
    errorView.render(error);
  }
};

const controlCityWeather = async function () {
  try {
    // 1. load forecast with default units
    await model.loadForecast(units);

    // 2. Render city current temperature, Name and date
    cityView.render(model.state);
    cityView.setBackground();

    // 3. Render weather metrics
    metricsView.render(model.state.weather);

    // 4. Render hourly forecast of current day
    hourlyView.render(model.getHoulryDayWeather());

    // 5. load 7-days forecast
    await model.loadDailyForecast(units.temperature);

    // 6. Render 7-days forecast
    dailyView.render(model.state.weather.daily);
  } catch (error) {
    errorView.render(error);
  }
};

const controlHourlyDay = function (checkedDay) {
  // 1. get hourly forecast of selected day
  const data = model.getHoulryDayWeather(checkedDay);

  // 2. Render hourly forecast
  hourlyView.render(data);
};

const controlUnitSetting = async function (unit, value) {
  try {
    //  check selected unit - update default value - re-render data
    if (unit === 'temperature') {
      units.temperature = value;
      await controlCityWeather(units);
    }
    if (unit === 'precipitation') {
      units.precipitation = value;
      await model.loadPrecipitaion(units.precipitation);

      metricsView.renderPrecipitation(model.getPreciptation());
    }
    if (unit === 'wind-speed') {
      units.windSpeed = value;
      await model.loadWindSpeed(units.windSpeed);

      metricsView.renderWind(model.getWindSpeed());
    }
  } catch (error) {
    errorView.render(error);
  }
};

const controlUpdateBookmarks = function (bookmarkedCity) {
  // 1. Update bookmarks state
  model.updateBookmark(bookmarkedCity);

  // 2. update view of city
  cityView.update(model.state);

  // 3. render bookmarks after update state
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = async function (bookmarkedCity) {
  try {
    const { name: city, country } = bookmarkedCity;
    // 1. Check selected city if currently displayed or not
    if (city === model.state.city.name && country === model.state.city.country)
      return;

    // 2. get forecast if it's not the displayed city
    await controlCitySearch(city);
  } catch (error) {
    errorView.render(error);
  }
};

const init = function () {
  controlUserLocation();
  searchbarView.addHandlerSearch(controlCitySearch);
  hourlyView.addHandlerInputDay(controlHourlyDay);
  cityView.addHandlerAddBookmark(controlUpdateBookmarks);
  bookmarksView.addHandlerBookmarkMenu(controlBookmarks);
  bookmarksView.render(model.state.bookmarks);
  settingView.addHandlerInputUnits(controlUnitSetting);
};

init();
