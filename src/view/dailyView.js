import icons from "url:../../img/symbol-defs.svg";
import { WEATHER_CODE } from "../config";
import { View } from "./view";
class DailyView extends View {
  _parentEl = document.querySelector(".daily-forecast");

  _generateMarkup() {
    return `
      <p class="daily-forecast__title">Daily forecast</p>
      ${this._data.map(this._generateDayBox).join("")}

    `;
  }

  _generateDayBox(day) {
    return `
      <div class="daily-forecast-box">
        <div class="daily-forecast__weekday">${new Intl.DateTimeFormat(
          navigator.language,
          {
            weekday: "short",
          }
        ).format(new Date(day.time))}</div>
          <svg class="daily-forecast__icon">
          <use xlink:href="${icons}#${WEATHER_CODE.get(day.code)}"></use>
        </svg>  
        <div class="daily-forecast__deg">
          <div class="daily-forecast__deg--morning">${day.max}&deg;</div>
          <div class="daily-forecast__deg--night">${day.min}&deg;</div>
        </div>
      </div>
    `;
  }
}

export default new DailyView();
