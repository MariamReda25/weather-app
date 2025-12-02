import { View } from "./view";

class MetricsView extends View {
  _parentEl = document.querySelector(".forecast-metrics");
  _precipitationBox = document.querySelector(".forecast-metrics--4");
  _windnBox = document.querySelector(".forecast-metrics--3");
 
  render (data) {
    this._data = data;

    const metricesValue = Array.from(
      document.querySelectorAll(".forecast-metrics__value")
    );

    metricesValue.forEach((metric, i) => {
      metric.textContent = `${Object.values(this._data.metrics[i]).lastItem} ${
        Object.values(this._data.units[i]).lastItem
      }`;
    });
  }

  renderPrecipitation(data) {
    const precipValue = this._precipitationBox.lastElementChild;
    precipValue.textContent = `${data.value} ${data.unit}`;
  }

  renderWind(data) {
    const windValue = this._windnBox.lastElementChild;
    windValue.textContent = `${data.value} ${data.unit}`;
  }
}
export default new MetricsView();
