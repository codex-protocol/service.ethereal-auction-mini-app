const socket = io()

const $content = document.querySelector('.content')
const $artwork = document.querySelector('.artwork img')

const $usd = document.querySelector('[data-bind="usd"]')
const $eth = document.querySelector('[data-bind="eth"]')
const $btc = document.querySelector('[data-bind="btc"]')

socket.on('update-state', (newState) => {

  if (newState.currencyValues.usd === 0) {
    $content.classList.add('hide')
  } else {
    $content.classList.remove('hide')
  }

  $artwork.src = newState.currentArtworkUrl || ''

  $usd.innerText = (newState.currencyValues.usd || 0).toLocaleString()
  $eth.innerText = (newState.currencyValues.eth || 0).toFixed(5)
  $btc.innerText = (newState.currencyValues.btc || 0).toFixed(5)

})

document.body.addEventListener('click', (event) => {

  if (!event.shiftKey) {
    return
  }

  if (typeof document.body.requestFullscreen === 'function') {
    document.body.requestFullscreen()

  } else if (typeof document.body.webkitRequestFullScreen === 'function') {
    document.body.webkitRequestFullScreen()

  } else if (typeof document.body.mozRequestFullScreen === 'function') {
    document.body.mozRequestFullScreen()
  }

})
