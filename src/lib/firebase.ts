import _ from 'lodash'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

// must refer as process.env.NEXT_XXX
// see https://nextjs.org/docs/basic-features/environment-variables
const config = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
}

if (_.isEmpty(firebase.apps)) {
  firebase.initializeApp(config)
}

if (_.isEqual(process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR, 'true')) {
  firebase.auth().useEmulator('http://localhost:9099')
  firebase.functions().useEmulator('localhost', 5001)
  firebase.firestore().useEmulator('localhost', 8080)
  firebase.storage().useEmulator('localhost', 9199)
}

export default firebase
