export class View {
  _parentEl;
  _data;
  _btnDropdown;
  _menuDropdown;

  render(data) {
    if (!data) return;

    this._data = data;
    this._clear();
    const markup = this._generateMarkup();
    this._parentEl.insertAdjacentHTML("beforeend", markup);
  }

  update(data) {
    if (!data) return;

    this._data = data;

    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElemenst = Array.from(newDOM.querySelectorAll("*"));
    const currentElements = Array.from(this._parentEl.querySelectorAll("*"));

    newElemenst.forEach((newEl, i) => {
      const curEl = currentElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attribute) =>
          curEl.setAttribute(attribute.name, attribute.value)
        );
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }

  _addHandlerBtnDropdown() {
    this._btnDropdown.addEventListener(
      "click",
      this._dropdownHandler.bind(this)
    );
  }

  _dropdownHandler() {
    this._menuDropdown.classList.toggle("active");
  }
}
