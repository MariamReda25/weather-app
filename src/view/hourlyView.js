import icons from "url:../../img/symbol-defs.svg";
import { WEATHER_CODE } from "../config";
import { View } from "./view";
class HourlyView extends View {
  _parentEl = document.querySelector(".hourly-forecast");
  _btnDropdown = document.querySelector(".dropdown__button--day");
  _menuDropdown = document.querySelector(".dropdown__menu--day");
  _inputDays = document.querySelectorAll(".input-day");
  _titleDropdown = document.querySelector(".dropdown__title--day");

  constructor() {
    super();
    this._addHandlerBtnDropdown();
  }

  render(data) {
    this._data = data;

    this._clear();
    const markup = this._generateMarkup();
    this._parentEl.insertAdjacentHTML("beforeend", markup);
    this._titleDropdown.textContent = this._data[0].day;
  }

  _clear() {
    const hourlyBox = Array.from(
      document.querySelectorAll(".hourly-forecast-box")
    );

    hourlyBox.forEach((el) => el.remove());
  }

  _generateMarkup() {
    return `
      ${this._data.map(this._generateHourlyBox).join("")}
    `;
  }

  _generateHourlyBox(hour) {
    return `
      <div class="hourly-forecast-box">
         <svg class="hourly-forecast__icon">
          <use xlink:href="${icons}#${WEATHER_CODE.get(
      hour.weatherCode
    )}"></use>
        </svg>
        <p class="hourly-forecast__hour">${new Intl.DateTimeFormat(
          navigator.language,
          {
            hour: "2-digit",
          }
        ).format(new Date(hour.time))}</p>
        <p class="hourly-forecast__deg">${hour.temperature}&deg;</p>  
      </div>
    `;
  }

  addHandlerInputDay(handler) {
    this._menuDropdown.addEventListener("click", (e) => {
      const selectedDay = e.target;
      const sibilings = Array.from(e.target.parentElement.children);
      sibilings.forEach((element) => element.classList.remove("selected"));
      selectedDay.classList.add("selected");
      this._dropdownHandler();
      handler(selectedDay.dataset.value);
    });
  }
}

export default new HourlyView();
