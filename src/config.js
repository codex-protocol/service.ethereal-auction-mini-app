import dotenv from 'dotenv'

// Reads environment variables stored in the '.env' file and writes them to the
//  process.env object
const dotenvResult = dotenv.config({ path: `${__dirname}/../.env` })

if (dotenvResult.error) {
  throw dotenvResult.error
}

const config = {
  development: {
    process: {
      port: 3002,
      logLevel: 'silly',
    },
  },

  staging: {
    process: {
      port: 3000,
      logLevel: 'verbose',
    },
  },

  production: {
    process: {
      port: 3000,
      logLevel: 'info',
    },
  },
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export default config[process.env.NODE_ENV]
