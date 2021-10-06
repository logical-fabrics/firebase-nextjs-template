const _ = require('lodash')
const functions = require('firebase-functions')
const { logger } = functions
const { default: next } = require('next')

const nextjsDistDir = require('../../next.config.js').distDir
const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir,
  },
})

const minInstances = _.toNumber(
  _.get(functions.config(), 'env.cf_min_instances', 0)
)

const nextjsHandle = nextjsServer.getRequestHandler()

module.exports = functions
  .runWith({ memory: '2GB' })
  .runWith({ memory: '2GB', minInstances })
  .https.onRequest((req, res) => {
    return nextjsServer.prepare().then(() => {
      logger.info(req.path, req.query)
      return nextjsHandle(req, res)
    })
  })
