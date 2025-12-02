import { View } from './view';

class SettingView extends View {
  _btnDropdown = document.querySelector('.dropdown__button--setting');
  _menuDropdown = document.querySelector('.dropdown__menu--setting');
  _inputUnits = document.querySelectorAll('.dropdown__list');

  constructor() {
    super();
    this._addHandlerBtnDropdown();
  }

  addHandlerInputUnits(handler) {
    this._inputUnits.forEach(input => {
      input.addEventListener('click', e => {
        const selected = e.target;
        if (!selected.classList.contains('dropdown__list--item')) return;

        const siblings = Array.from(e.target.parentElement.children);
        siblings.forEach(
          sibling =>
            sibling.classList.contains('dropdown__list--item') &&
            sibling.classList.remove('selected')
        );
        this._dropdownHandler();
        selected.classList.add('selected');
        handler(selected.dataset.unit, selected.dataset.value);
      });
    });
  }
}

export default new SettingView();
