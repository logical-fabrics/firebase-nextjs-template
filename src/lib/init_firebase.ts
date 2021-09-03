import _ from 'lodash'
import { getApps, initializeApp } from '@firebase/app'
import { getAuth, connectAuthEmulator } from '@firebase/auth'
import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from '@firebase/functions'
import { getStorage, connectStorageEmulator } from '@firebase/storage'

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

let app
if (_.isEmpty(getApps())) {
  app = initializeApp(config)

  if (_.isEqual(process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR, 'true')) {
    connectAuthEmulator(getAuth(), 'http://localhost:9099')
    connectFunctionsEmulator(getFunctions(), 'localhost', 5001)
    connectFirestoreEmulator(getFirestore(), 'localhost', 8080)
    connectStorageEmulator(getStorage(), 'localhost', 9199)
  }
}

export default app
