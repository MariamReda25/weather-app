export const COUNTRY_API =
  "https://geocoding-api.open-meteo.com/v1/search?name=";

export const POSITION_API = `https://api.bigdatacloud.net/data/reverse-geocode-client?`;
export const WEATHER_API = `https://api.open-meteo.com/v1/forecast?`;
export const WAETHER_API_METRICS = `&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,apparent_temperature,is_day`;
export const WAETHER_API_DAILY = `&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7`;

export const WEATHER_CODE = new Map([
  [0, "icon-sun"],
  [1, "icon-cloudy"],
  [2, "icon-cloud1"],
  [3, "icon-cloudy1"],
  [45, "icon-windy"],
  [48, "icon-windy"],
  [51, "icon-rainy"],
  [53, "icon-rainy"],
  [55, "icon-rainy"],
  [56, "icon-rainy"],
  [57, "icon-rainy"],
  [61, "icon-rainy1"],
  [63, "icon-rainy1"],
  [65, "icon-rainy1"],
  [66, "icon-rainy1"],
  [67, "icon-rainy1"],
  [71, "icon-snowy"],
  [73, "icon-snowy"],
  [75, "icon-snowy1"],
  [77, "icon-snowy1"],
  [80, "icon-lightning1"],
  [81, "icon-lightning1"],
  [82, "icon-lightning1"],
  [85, "icon-weather"],
  [95, "icon-wind"],
  [96, "icon-winf"],
  [99, "icon-wind"],
]);
