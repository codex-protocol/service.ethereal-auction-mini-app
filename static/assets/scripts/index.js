const socket = io()

const $content = document.querySelector('.content')

const $usd = document.querySelector('[data-bind="usd"]')
const $eth = document.querySelector('[data-bind="eth"]')
const $btc = document.querySelector('[data-bind="btc"]')

socket.on('update-values', (newValues) => {

  if (newValues.usd !== 0) {
    $content.classList.remove('hide')
  }

  $usd.innerText = (newValues.usd || 0).toLocaleString()
  $eth.innerText = (newValues.eth || 0).toFixed(5)
  $btc.innerText = (newValues.btc || 0).toFixed(5)

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
