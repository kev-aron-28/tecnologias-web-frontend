import { ForecastFacade } from "../api/ForecastFacade";
import { Weather } from "../api/Weather";
import { OpenDrawerEventDetail, events, openDrawer } from "../stateManager";

class Drawer extends HTMLElement {
  public shadow = this.attachShadow({ mode: 'open' })
  private forecastFacade = new ForecastFacade()
  constructor() {
    super()
    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
  }

  closeModal() {
    const container = this.shadow.getElementById('container')
    if (!container) return

    container.classList.add('removeItemAnimation')
    container.addEventListener("animationend", function () {
      container.style.display = 'none'
    }, { once: true });
  }

  openModal() {
    const container = this.shadow.getElementById('container')
    if (!container) return
    container.classList.remove('removeItemAnimation')
    container.style.display = 'flex'
  }

  connectedCallback() {
    const template = document.createElement('template');
    events.addEventListener(openDrawer, ((event: CustomEvent<OpenDrawerEventDetail>) => {
      if (!event.detail.weatherId || !event.detail.munName) return
      const id = event.detail.weatherId
      const name = event.detail.munName
      const data = this.forecastFacade.getForecastById(id, name)
      this.renderInfo(data)
      this.openModal()
    }) as EventListener)

    template.innerHTML = this.render()
    this.shadow.appendChild(template.content)
    this.shadow.getElementById('close')?.addEventListener('click', this.closeModal)
  }

  renderInfo(forecast: Weather[]) {
    const nstate = document.querySelector('drawer-weather')?.shadowRoot?.getElementById('nstate')
    const nmun = document.querySelector('drawer-weather')?.shadowRoot?.getElementById('nmun')
    const tempMax = document.querySelector('drawer-weather')?.shadowRoot?.getElementById('tempMax')
    const clouds = document.querySelector('drawer-weather')?.shadowRoot?.getElementById('clouds')
    const prep = document.querySelector('drawer-weather')?.shadowRoot?.getElementById('prep')
    const wind = document.querySelector('drawer-weather')?.shadowRoot?.getElementById('wind')
    const tempMin = document.querySelector('drawer-weather')?.shadowRoot?.getElementById('min')
    const timeLine = document.querySelector('drawer-weather')?.shadowRoot?.getElementById('content-line')

    if (!nstate || !nmun || !tempMax || !clouds || !prep || !wind || !tempMin || !timeLine) return
    nstate.innerText = forecast[0].nEst
    nmun.innerText = `${forecast[0].nMun} | ${forecast[0].skyDesc}`
    tempMax.innerText = `${forecast[0].tMax}°`
    clouds.innerText = `${forecast[0].clouds}%`
    prep.innerText = `${forecast[0].precipitationProb}%`
    wind.innerText = `${forecast[0].velWind} km/h`
    tempMin.innerText = `${forecast[0].tMin}°`
    
    const timeLineCards = forecast.slice(1).reduce((acc, curr) => {
      return acc + this.createCardLineTime(
        curr.clouds,
        curr.precipitationProb,
        curr.velWind,
        curr.tMin,
        curr.tMax,
        curr.day
      )
    }, '')
    
    timeLine.innerHTML = timeLineCards    
  }

  createCardLineTime(
    clouds: number,
    prep: number,
    wind: number,
    tempMin: number,
    tempMax: number,
    day: number
  ) {
    return `
    <div class="card">
      <div class="info">
        <h3 class="title">Dia ${day + 1}</h3>
        <div class="weather__drawer__info__current__stat">
            <p>Nubes</p>
            <p id="clouds">${clouds}%</p>
        </div>
        <div class="weather__drawer__info__current__stat">
          <p>Precipitacion</p>
          <p id="prep">${prep}%</p>
        </div>
        <div class="weather__drawer__info__current__stat">
          <p>Viento</p>
          <p id="wind">${wind}%</p>
        </div>
        <div class="weather__drawer__info__current__stat">
          <p>Temp. minima</p>
          <p id="min">${tempMin}°</p>
        </div>
        <div class="weather__drawer__info__current__stat">
          <p>Temp. maxima</p>
          <p id="min">${tempMax}°</p>
        </div>
      </div>
    </div>
    `
  }

  render() {
    return ` 
    <style>
      .weather__drawer {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        backdrop-filter: blur(10px);
        box-shadow: 0px 6px 15px -9px #0099ff;
        animation: fadeIn .5s linear;
        display: none;
        flex-direction: column;
        align-items: center;
        overflow-y: scroll;
        z-index: 10000;
      }

      .weather__drawer::-webkit-scrollbar-track
      {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: transparent;
      }

      .weather__drawer::-webkit-scrollbar
      {
        width: 2px;
        background-color: transparent;
      }

      .weather__drawer::-webkit-scrollbar-thumb
      {
        background-color: #000000;
        border: 1px solid #555555;
      }


      @media only screen and (min-width: 1200px){
        .weather__drawer {
          width: 350px;
        }
      }

      .removeItemAnimation {
        animation: off 1s;
      }

      .weather__drawer__close {
        display: flex;
        width: 100%;
        cursor: pointer;
        margin-top: 20px;
      }

      .weather__drawer__close svg {
        margin: 10px;
        width: 20px;
        height: 20px;
        border: 1px solid #ffff;
        border-radius: 50%;
        padding: 5px;
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
      
      @keyframes off {
        0% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateY(-100%);
        }
      }

      .weather__drawer__name {
        display: flex;
        align-items:center;
        justify-content: center;
        flex-direction: column;
      }

      .weather__drawer__name p {
        font-size: 25px;
        text-align:center;
      }
      
      .weather__drawer__temp p {
        font-size: 90px;
      }

      .weather__drawer__info {
        width: 90%;
      }

      .weather__drawer__info__current {
        width: 100%;
        display:flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .weather__drawer__info__current__stat {
        width: 95%;
        display:flex;
        justify-content:space-between;
      }

      .weather__drawer__info__current__stat p{
        font-size: 13px;
      }

      .timeline {
        margin: 20px auto;
        padding: 20px;
      }
      
      .outer {
        border-left: 2px solid #333;
      }
      
      .card {
        position: relative;
        margin: 0 0 20px 20px;
        padding: 10px;
        color: gray;
        border-radius: 8px;
        max-width: 400px;
        border: 1px solid #bcbcbc;
      }
      
      .info {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .title {
        position: relative;
      }
      
      .title::before {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        background: transparent;
        border-radius: 999px;
        left: -39px;
        border: 3px solid #bcbcbc;
      }
      
      
    </style>
    <div class="weather__drawer" id="container">
      <div class="weather__drawer__close" id="close">
        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#ffffff" d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
      </div>
      <div class="weather__drawer__name">
        <p id="nstate">New york</p>
        <small id="nmun">State | Weather</small>
      </div>
      <div class="weather__drawer__temp">
        <p id="tempMax">15°</p>
      </div>
      <div class="weather__drawer__info">
        <p>Weather details</p>
        <div class="weather__drawer__info__current">
          <div class="weather__drawer__info__current__stat">
            <p>Nubes</p>
            <p id="clouds">55%</p>
          </div>
          <div class="weather__drawer__info__current__stat">
            <p>Precipitacion</p>
            <p id="prep">55%</p>
          </div>
          <div class="weather__drawer__info__current__stat">
            <p>Viento</p>
            <p id="wind">55%</p>
          </div>
          <div class="weather__drawer__info__current__stat">
            <p>Temp. minima</p>
            <p id="min">55%</p>
          </div>
        </div>
        
        <p>Pronostico</p>

          <div class="timeline">
            <div class="outer" id="content-line">
            </div>
          </div>

      </div>
    </div>
  `;
  }

}

customElements.define('drawer-weather', Drawer)
