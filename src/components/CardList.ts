import { ForecastFacade } from "../api/ForecastFacade"
import { Weather } from "../api/Weather"

class CardList extends HTMLElement {
  private forecastFacade = new ForecastFacade()
  private listRender: Weather[] = []
  public shadow = this.attachShadow({ mode: 'open' })
  private _currentIndex: number = 0
  constructor() {
    super()
    this._currentIndex = 0
    this.listRender = this.forecastFacade.getAllPaginated(this.currentIndex)
    this.back = this.back.bind(this)
    this.next = this.next.bind(this)
  }

  set currentIndex(value: number) {
    this._currentIndex = value
  }

  get currentIndex() {
    return this._currentIndex
  }
 
  createList() {
    const createCard = (id: string, state: string, mun: string, temp: number, sky: string) =>
      `<weather-card 
      state="${state}" 
      municipality="${mun}" 
      maxTemp="${temp}" 
      sky="${sky}"
      idWeather="${id}"
      ></weather-card>`
    const list = this.listRender.reduce((acc, curr) => {
      return acc + createCard(curr.id, curr.nEst, curr.nMun, curr.tMax, curr.skyDesc)
    }, '')

    return list
  }

  back() {
    if (this.currentIndex == 0) {
      return
    }
    this.currentIndex = this.currentIndex - 5
    const page = document.querySelector('card-list')?.shadowRoot?.getElementById('page-current')

    if (!page) {
      return
    }
    page.innerText = `${this.currentIndex / 5}`
    this.updateList()
  }

  next() {
    this.currentIndex = this.currentIndex + 5
    const page = document.querySelector('card-list')?.shadowRoot?.getElementById('page-current')
    if (!page) {
      return
    }

    page.innerText = `${this.currentIndex / 5}`
    this.updateList()
  }

  updateList() {
    const list = document.querySelector('card-list')?.shadowRoot?.getElementById('card-list')
    if(!list) return
    this.listRender = this.forecastFacade.getAllPaginated(this.currentIndex)
    list.innerHTML = this.createList()
  }

  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = this.render()
    this.shadow.appendChild(template.content)
    this.shadow.getElementById('pagination-back')?.addEventListener('click', this.back)
    this.shadow.getElementById('pagination-next')?.addEventListener('click', this.next)
  }

  render() {
    return `
    <style>
      .weather__cards {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-direction: column;
      }

      .weather__cards__title {
        margin-left: 10px;
        align-self: flex-start;
      }


      @media only screen and (max-width: 1200px){
        .weather__cards__list {
          width: 95%;
          display:flex;
          overflow-x: scroll;
          overflow-y: hidden;
          transition: .2s;
        }
      }

      @media only screen and (min-width: 1200px){
        .weather__cards__list {
          width: 95%;
          display: flex;
          justify-content: space-evenly;
          transition: .2s;
        }
      }

      .weather__pagination {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 50px;
      }

      .weather__pagination__buttons {
        display: flex;
        align-items:center;
        justify-content: space-between;
        min-width: 250px;
      }

      .weather__pagination__buttons button {
        width: 40%;
        height: 35px;
        outline: none;
        border: none;
        background: transparent;
        border: 1px solid #ffff;
        cursor: pointer;
      }

    </style>
    <div class="weather__cards">
      <h3 class="weather__cards__title">Locations</h3>
      <div class="weather__cards__list" id="card-list">
        ${this.createList()}
      </div>
      <div class="weather__pagination">
      <div class="weather__pagination__buttons">
        <button id="pagination-back">
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#ffffff" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
        </button>
        <small id="page-current">${this.currentIndex}</small>
        <button id="pagination-next">
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#ffffff" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
        </button>
      </div>
    </div>
    </div>
  `;
  }

}

customElements.define('card-list', CardList)
