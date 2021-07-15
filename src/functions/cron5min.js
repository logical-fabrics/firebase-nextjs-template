const { pubsub } = require('firebase-functions')
const axios = require('axios')

const { GCLOUD_PROJECT } = process.env
const CF_ENDPOINT_US = `https://us-central1-${GCLOUD_PROJECT}.cloudfunctions.net`

module.exports = pubsub.schedule('every 5 minutes').onRun(async () => {
  try {
    await axios.get(`${CF_ENDPOINT_US}/nextApp`)
  } catch (e) {
    console.error(e)
  }
  return null
})
