import { View } from "./view";

class ErrorView extends View {
  _parentEl = document.querySelector(".popup");
  _btnClose = document.querySelector(".popup__btn");
  _errorText = document.querySelector(".popup__text");

  _overlay = document.querySelector("body");
  constructor() {
    super();
    this._addHandlerCloseBtn();
  }
  render(error) {
    this._parentEl.classList.add("popup--active");
    this._errorText.textContent = `${error} ⛔`;
  }

  _addHandlerCloseBtn() {
    this._btnClose.addEventListener("click", this._closeBtnHandler.bind(this));
    this._overlay.addEventListener("click", this._closeBtnHandler.bind(this));
  }

  _closeBtnHandler() {
    this._parentEl.classList.remove("popup--active");
  }
}

export default new ErrorView();
