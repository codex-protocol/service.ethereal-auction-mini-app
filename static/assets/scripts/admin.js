const socket = io()

let state = null
let currentArtworkIndex = 0

const $artworkThumbnails = document.querySelector('#artwork-thumbnails')
const $incrementButtons = document.querySelectorAll('[data-increment]')

const $updateUsdValueForm = document.querySelector('form[name="update-usd-value"]')
const $newUsdValueInput = $updateUsdValueForm.querySelector('input[name="new-usd-value"]')

const setArtworkAndReset = (newArtworkUrl) => {
  socket.emit('update-usd-value', 0)
  setTimeout(() => {
    socket.emit('update-current-artwork-filename', newArtworkUrl)
  }, 500)
}

const renderArtworkThumbnails = () => {

  if (!state) return

  $artworkThumbnails.innerHTML = ''

  state.artworkUrls.forEach((artworkUrl, index) => {

    const $thumbnail = new Image()
    const $container = document.createElement('div')

    $thumbnail.src = artworkUrl
    $container.classList.add('artwork-thumbnail')

    if (artworkUrl === state.currentArtworkUrl) {
      currentArtworkIndex = index
      $container.classList.add('active')
    }

    $thumbnail.addEventListener('click', () => {
      setArtworkAndReset(artworkUrl)
    })

    $container.appendChild($thumbnail)
    $artworkThumbnails.appendChild($container)

  })
}

const updateUsdValue = () => {

  const newValue = Number.parseFloat($newUsdValueInput.value)

  if (Number.isNaN(newValue)) {
    alert(`${$newUsdValueInput.value} is not a valid number`) // eslint-disable-line no-alert
    return
  }

  socket.emit('update-usd-value', newValue)

}

socket.on('update-state', (newState) => {
  state = newState
  renderArtworkThumbnails()
  $newUsdValueInput.value = state.currencyValues.usd
})

$updateUsdValueForm.addEventListener('submit', (event) => {
  event.preventDefault()
  updateUsdValue()
})

$incrementButtons.forEach(($incrementButton) => {

  const incrementValue = Number.parseFloat($incrementButton.getAttribute('data-increment'))

  $incrementButton.addEventListener('click', (event) => {
    $newUsdValueInput.blur()
    $newUsdValueInput.value = Number.parseFloat($newUsdValueInput.value) + incrementValue
  })
})

document.addEventListener('keydown', (event) => {

  let nextArtworkUrl = null

  switch (event.code) {
    case 'Enter':
      updateUsdValue()
      break

    case 'ArrowRight':
      nextArtworkUrl = state.artworkUrls[currentArtworkIndex + 1]
      break

    case 'ArrowLeft':
      nextArtworkUrl = state.artworkUrls[currentArtworkIndex - 1]
      break

    case 'Digit1':
    case 'Digit2':
    case 'Digit3':
    case 'Digit4':
    case 'Digit5':
    case 'Digit6':
    case 'Digit7':
    case 'Digit8':
    case 'Digit9':
      $incrementButtons[+event.code.substr(5) - 1].click()
      break

    case 'Digit0':
      $incrementButtons[9].click()
      break

    default:
      break
  }

  if (nextArtworkUrl) {
    socket.emit('update-usd-value', 0)
    setTimeout(() => {
      setArtworkAndReset(nextArtworkUrl)
    }, 500)
  }
})
