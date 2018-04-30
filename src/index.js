import 'babel-polyfill'

import http from 'http'
import io from 'socket.io'
import express from 'express'
import Bluebird from 'bluebird'
import requestPromise from 'request-promise'

import config from './config'
import logger from './services/logger'

const app = express()
const httpApp = http.Server(app)
const socketApp = io(httpApp)

app.use(express.static(`${__dirname}/../static`))

const currentValues = {
  usd: 0,
  eth: 0,
  btc: 0,
}

const conversionRates = {
  eth: 0,
  btc: 0,
}

const updateCurrentValues = (newUsdValue = currentValues.usd) => {
  currentValues.usd = Number.parseFloat(newUsdValue)
  currentValues.eth = Number.parseFloat(newUsdValue / conversionRates.eth)
  currentValues.btc = Number.parseFloat(newUsdValue / conversionRates.btc)
  socketApp.emit('update-values', currentValues)
}

const updateConversionRates = (shouldEmit = true) => {

  const promises = {
    eth: requestPromise({
      uri: 'https://api.coinmarketcap.com/v1/ticker/ethereum/',
      method: 'get',
      json: true,
    }),
    btc: requestPromise({
      uri: 'https://api.coinmarketcap.com/v1/ticker/bitcoin/',
      method: 'get',
      json: true,
    }),
  }

  return Bluebird.props(promises)
    .then((responses) => {

      const newEthConversionRate = responses.eth[0].price_usd
      const newBtcConversionRate = responses.btc[0].price_usd
      const oldEthConversionRate = conversionRates.eth
      const oldBtcConversionRate = conversionRates.btc

      conversionRates.eth = newEthConversionRate
      conversionRates.btc = newBtcConversionRate

      if (shouldEmit && (newEthConversionRate !== oldEthConversionRate || newBtcConversionRate !== oldBtcConversionRate)) {
        updateCurrentValues()
      }

    })
}

socketApp.on('connection', (socket) => {
  socket.emit('update-values', currentValues)
  socket.on('update-usd-value', (newUsdValue) => {
    updateConversionRates(false)
    updateCurrentValues(newUsdValue)
  })
})

updateConversionRates(false)
  .then(() => {
    const listener = httpApp.listen(config.process.port, () => {
      logger.info(`server listening on port ${listener.address().port}`)
      setInterval(updateConversionRates, 60 * 1000)
    })
  })
