class SearchbarView {
  _parentEl = document.querySelector(".search-bar");

  addHandlerSearch(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const inputEl = document.querySelector(".search-bar__input");
      const inputCountry = inputEl.value;
      inputEl.value = "";
      inputEl.blur();
      handler(inputCountry);
    });
  }
}

export default new SearchbarView();
