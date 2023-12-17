import { events } from "../stateManager";

class WeatherCard extends HTMLElement {
  
  constructor() {
    super()
  }

  static get observedAttributes() {
    return ["state", "municipality", "maxTemp", "sky", "idWeather"];
  }

  get state() {
    return this.getAttribute('state')
  }

  get idWeather() {
    return this.getAttribute('idWeather')
  }

  get municipality() {
    return this.getAttribute('municipality')
  }

  get maxTemp() {
    return this.getAttribute('maxTemp')
  }

  get sky() {
    return this.getAttribute('sky')
  }

  async connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const template = document.createElement('template');
    this.onclick = () => events.openDrawer(this.idWeather, this.municipality)
    template.innerHTML = `
    <style>
      .weather__card {
        width: 140px;
        height: 210px;
        border-radius: 10px;
        margin-top: 5px;
        margin-left: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        animation: fadeIn .5s linear;
        backdrop-filter: blur(10px);
        box-shadow: 0px 6px 15px -9px #0099ff;
        cursor: pointer;
      }

      .weather__card__info {
        width: 90%;
        height: 90%;
        z-index: 10;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: column;
      }

      .weather__card__info__name {
        text-align: center;
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .weather__card__info__name small {
        font-size: 10px;
        margin-top: -10px;
      }

      @keyframes fadeIn {
        0% {
          opacity: 0;
          top: 150px;
        }
        75% {
          opacity: 0.5;
          top: 0px;
        }
        100% {
          opacity: 1;
        }
      }
      
    </style>
    <div class="weather__card">
      <div class="weather__card__info">
        <div class="weather__card__info__name">
          <p>${this.state}</p>
          <small>${this.municipality}</small>
        </div>
        <h1>${this.maxTemp}°</h1>
        <div class="weather__card__info__status">
          <small>${this.sky}</small>
        </div>
      </div>
    </div>
  `;
    shadowRoot.appendChild(template.content)
  }

}

customElements.define('weather-card', WeatherCard)
