const { pubsub } = require('firebase-functions')
const admin = require('firebase-admin')
const { Storage } = require('@google-cloud/storage')

const { GCLOUD_PROJECT } = process.env
const BUCKET_NAME = `${GCLOUD_PROJECT}-backup`

module.exports = pubsub
  .schedule('0 1 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
    const accessToken = await admin.credential
      .applicationDefault()
      .getAccessToken()
      .then((result) => result.access_token)

    const storage = new Storage()
    const bucket = storage.bucket(BUCKET_NAME)

    const exists = await bucket.exists().then((s) => s[0])
    if (!exists) return

    await axios.post(
      `https://firestore.googleapis.com/v1/projects/${GCLOUD_PROJECT}/databases/(default):exportDocuments`,
      { outputUriPrefix: `gs://${BUCKET_NAME}` },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
  })
