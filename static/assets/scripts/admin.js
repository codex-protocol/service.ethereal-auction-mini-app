const socket = io()

let state = null
let currentArtworkIndex = 0

const $artworkThumbnails = document.querySelector('#artwork-thumbnails')

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


socket.on('update-state', (newState) => {
  state = newState
  renderArtworkThumbnails()
  $newUsdValueInput.value = state.currencyValues.usd
})

$updateUsdValueForm.addEventListener('submit', (event) => {

  event.preventDefault()

  const newValue = Number.parseFloat($newUsdValueInput.value)

  if (Number.isNaN(newValue)) {
    alert(`${$newUsdValueInput.value} is not a valid number`) // eslint-disable-line no-alert
    return
  }

  socket.emit('update-usd-value', newValue)

})

document.addEventListener('keyup', (event) => {

  let nextArtworkUrl = null

  switch (event.code) {
    case 'ArrowRight': {
      nextArtworkUrl = state.artworkUrls[currentArtworkIndex + 1]
      break

    }

    case 'ArrowLeft': {
      nextArtworkUrl = state.artworkUrls[currentArtworkIndex - 1]
      break

    }

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
