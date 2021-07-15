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
const nextjsHandle = nextjsServer.getRequestHandler()

module.exports = functions
  .runWith({ memory: '2GB' })
  .https.onRequest((req, res) => {
    return nextjsServer.prepare().then(() => {
      logger.info(req.path, req.query)
      return nextjsHandle(req, res)
    })
  })
