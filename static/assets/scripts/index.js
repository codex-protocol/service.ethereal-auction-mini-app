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

document.addEventListener('keydown', (event) => {

  const currentPaddingBottom = Number.parseFloat($content.style.paddingBottom) || 1

  let newPaddingBottom = currentPaddingBottom

  switch (event.code) {
    case 'ArrowUp':
      if (currentPaddingBottom + 0.5 < 8) newPaddingBottom = currentPaddingBottom + 0.5
      break

    case 'ArrowDown':
      if (currentPaddingBottom - 0.5 > 0) newPaddingBottom = currentPaddingBottom - 0.5
      break

    default:
      break
  }

  $content.style.paddingBottom = `${newPaddingBottom}em`

})
