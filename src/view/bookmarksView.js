import icons from "url:../../img/symbol-defs.svg";
import { View } from "./view";
class BookmarksView extends View {
  _parentEl = document.querySelector(".dropdown__menu--fav");
  _btnDropdown = document.querySelector(".dropdown__button--fav");
  _menuDropdown = document.querySelector(".dropdown__menu--fav");

  constructor() {
    super();
    this._addHandlerBtnDropdown();
  }

  addHandlerBookmarkMenu(handler) {
    this._menuDropdown.addEventListener("click", (e) => {
      const selected = e.target.closest(".dropdown__item");

      if (!selected) return;

      const siblings = Array.from(selected.parentElement.children);
      siblings.forEach((sibling) => sibling.classList.remove("selected"));
      selected.classList.add("selected");
      this._dropdownHandler();
      handler({
        name: selected.dataset.name,
        country: selected.dataset.country,
      });
    });
  }

  _generateMarkup() {
    return `${this._data
      .map((bookmark) => {
        return ` <li class="dropdown__item" data-name="${bookmark.name}" data-country ="${bookmark.country}">
                <svg class="bookmarks__icon">
                  <use xlink:href="${icons}#icon-location-pin"></use>
                </svg>
                <p class="bookmarks__text" >${bookmark.name}, ${bookmark.country}</p>
              </li>`;
      })
      .join("")}`;
  }
}

export default new BookmarksView();
