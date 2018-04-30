const socket = io()
const $updateUsdValueForm = document.querySelector('form[name="update-usd-value"]')
const $newUsdValueInput = $updateUsdValueForm.querySelector('input[name="new-usd-value"]')

socket.on('update-values', (newValues) => {
  $newUsdValueInput.value = newValues.usd
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
