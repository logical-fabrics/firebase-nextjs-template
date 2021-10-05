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

console.log('aaa', process.env.FOO)

module.exports = functions
  .runWith({ memory: '2GB', minInstances: 1 })
  .https.onRequest((req, res) => {
    return nextjsServer.prepare().then(() => {
      logger.info(req.path, req.query)
      return nextjsHandle(req, res)
    })
  })
