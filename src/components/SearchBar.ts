import { ForecastFacade } from "../api/ForecastFacade"
import { events } from "../stateManager"

class SearchBar extends HTMLElement {
  private forecastFacade = new ForecastFacade()
  public shadow = this.attachShadow({ mode: 'open' })
  constructor() {
    super()
    this.getSuggestions = this.getSuggestions.bind(this)

  }


  getSuggestions() {
    const inputValue = this.shadow.querySelector('input')
    const sug = this.shadow.querySelector('.weather__search__suggestions') as HTMLDivElement
    if(inputValue?.value === '' || inputValue?.value == undefined) {
      sug.style.display = 'none'      
    } else {
      sug.style.display = 'flex'
      const search = this.forecastFacade.searchByTerm(inputValue?.value)
      const searchResult = (state: string, mun: string, id: string) => {
        const small = document.createElement('small')
        small.addEventListener('click', () => events.openDrawer(id, mun))
        small.innerText = `${state}, ${mun}`
        small.className = 'suggestion'
        return small
      };
      sug.innerHTML = ''
      search.forEach(weather => {
        sug.appendChild(searchResult(weather.nEst, weather.nMun, weather.id))
      })
    }
  }

  connectedCallback() {
    const footerTemplate = document.createElement('template');
    footerTemplate.innerHTML = `
    <style>
      .weather__search {
        width: 100%;
        height: 35vh;
        display:flex;
        flex-direction: column;
        align-items:center;
        justify-content: space-evenly;
        position: relative;
      }

      .weather__search__inital {
        min-width: 300px;
      }

      .weather__search__inital__greet {
        align-self: flex-start;
      }

      .weather__search__initial__title {
        margin-top: -10px;
      }

      .weather__search__input {
       min-width: 275px;
       min-height: 45px;
       border-radius: 150px;
       outline: none;
       background: transparent;
       border: 1px solid #bcbcbc;
       display:flex;
       align-items: center;
       justify-content: space-evenly;
      }

      .weather__search__input input {
        width: 70%;
        height: 100%;
        border: none;
        outline: none;
        background: transparent;
        padding: 5px;
        color: #ffff;
       }

       .weather__search__input input::placeholder {
        color: #ffff;
      }

      .weather__search__suggestions {
        min-width: 260px;
        background: white;
        height: 150px;
        margin-top: 20px;
        display:none;
        transition: .1s;
        position: absolute;
        bottom: -150px;
        border-radius: 5px;
        z-index: 20;
        border: 1px solid #bcbcbc;
        background: transparent;
        backdrop-filter: blur(10px);
        animation: fadeIn .2s linear;
        display: none;
        align-items: center;
        gap: 20px;
        flex-direction: column;
        overflow-y: scroll;
      }

      .suggestion {
        width: 100%;
        height: 50px;
        cursor: pointer;
      }

      .weather__search__suggestions::-webkit-scrollbar-track
      {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: transparent;
      }

      .weather__search__suggestions::-webkit-scrollbar
      {
        width: 5px;
        background-color: transparent;
      }

      .weather__search__suggestions::-webkit-scrollbar-thumb
      {
        background-color: #000000;
        border: 1px solid #555555;
      }
      
      @keyframes fadeIn {
        0% {
          opacity: 0;
        }
        75% {
          opacity: 0.5;
        }
        100% {
          opacity: 1;
        }
      }

    </style>
    <div class="weather__search">
      <div class="weather__search__inital">
        <h1 class="weather__search__initial__greet">Hello</h1>
        <p class="weather__search__initial__title">Find the weather by the city</p>
      </div>
      <div class="weather__search__input">
        <input type="text" placeholder="Search city" id="input">
        <i class="fa-solid fa-stethoscope"></i>
        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#ffffff" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
      </div>
      <div class="weather__search__suggestions">
      
      </div>
    </div>
  `;
    this.shadow.appendChild(footerTemplate.content)
    this.shadow.getElementById("input")?.addEventListener('input', this.getSuggestions)
  }

}

customElements.define('search-bar', SearchBar)
