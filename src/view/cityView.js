import icons from "url:../../img/symbol-defs.svg";
import { View } from "./view";

class CityView extends View {
  _parentEl = document.querySelector(".country-forecast");

  setBackground() {
    if (this._data.weather.isDay) this._parentEl.classList.add("day");
    else this._parentEl.classList.add("night");
  }
  renderLoader() {
    this._clear();
    const markup = `<div class="loading">
        <span class="loading__dot"></span>
        <span class="loading__dot"></span>
        <span class="loading__dot"></span>
        <p>Loading...</p>
      </div>`;
    this._parentEl.insertAdjacentHTML("beforeend", markup);
  }

  _generateMarkup() {
    const date = new Date(this._data.weather.currentTemp.time);

    return ` <div class="country-forecast__data">
        <div class="country-forecast__country">${this._data.city.name}, ${
      this._data.city.country
    }</div>
        <div class="country-forecast__date">${new Intl.DateTimeFormat(
          navigator.language,
          {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        ).format(date)}</div>
      </div>
      <div class="country-forecast__temperature">${
        this._data.weather.currentTemp.temperature
      }&deg;</div>

      <button class ="bookmarks__btn" >
        <svg class="bookmarks__icon ">
          <use xlink:href="${icons}#icon-heart${
      this._data.city.bookmarked ? ' ' : '-outlined'
    }"></use>
        </svg>
      </button>
    `;
  }

  addHandlerAddBookmark(handler) {
    this._parentEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".bookmarks__btn");
      if (!btn) return;

      handler({
        country: this._data.city.country,
        name: this._data.city.name,
      });
    });
  }
}

export default new CityView();
