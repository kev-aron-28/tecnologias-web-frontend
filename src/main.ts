import './style.css'
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="weather">
    <search-bar></search-bar>
    <card-list></card-list>
    <drawer-weather></drawer-weather>
  </main>
`
