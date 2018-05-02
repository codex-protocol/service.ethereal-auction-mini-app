import 'babel-polyfill'

import fs from 'fs'
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

const state = {
  conversionRates: {
    eth: 0,
    btc: 0,
  },
  currencyValues: {
    usd: 0,
    eth: 0,
    btc: 0,
  },
  artworkUrls: [],
  currentArtworkUrl: null,
}

const artworkDirectoryPath = `${__dirname}/../static/assets/images/artwork`

fs.readdirSync(artworkDirectoryPath).forEach((artworkFileName, index) => {
  if (!/^(_|\.)/.test(artworkFileName) && /\.jpg$/.test(artworkFileName)) {
    state.artworkUrls.push(`/assets/images/artwork/${artworkFileName}`)
  }
})

const updateCurrencyConversions = (newUsdValue = state.currencyValues.usd) => {
  state.currencyValues.usd = Number.parseFloat(newUsdValue)
  state.currencyValues.eth = Number.parseFloat(newUsdValue / state.conversionRates.eth)
  state.currencyValues.btc = Number.parseFloat(newUsdValue / state.conversionRates.btc)
  socketApp.emit('update-state', state)
}

const updateCurrencyValues = (shouldEmit = true) => {

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
      const oldEthConversionRate = state.conversionRates.eth
      const oldBtcConversionRate = state.conversionRates.btc

      state.conversionRates.eth = newEthConversionRate
      state.conversionRates.btc = newBtcConversionRate

      if (shouldEmit && (newEthConversionRate !== oldEthConversionRate || newBtcConversionRate !== oldBtcConversionRate)) {
        updateCurrencyConversions()
      }

    })
}

updateCurrencyValues(false)
  .then(() => {

    app.use(express.static(`${__dirname}/../static`))

    socketApp.on('connection', (socket) => {

      socket.emit('update-state', state)

      socket.on('update-usd-value', (newUsdValue) => {
        updateCurrencyValues(false)
        updateCurrencyConversions(newUsdValue)
      })

      socket.on('update-current-artwork-filename', (newArtworkUrl) => {
        if (state.artworkUrls.includes(newArtworkUrl)) {
          state.currentArtworkUrl = newArtworkUrl
          socketApp.emit('update-state', state)
        }
      })
    })

    const listener = httpApp.listen(config.process.port, () => {
      logger.info(`server listening on port ${listener.address().port}`)
      setInterval(updateCurrencyValues, 60 * 1000)
    })
  })
