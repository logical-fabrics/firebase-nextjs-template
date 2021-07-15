import _ from 'lodash'
import firebase from './firebase'
import { useEffect, useState, useContext, useReducer } from 'react'
import { FirebaseContext } from './contexts'

const FIREBASE_DEFAULTS = {
  firebase,
  auth: firebase.auth(),
  db: firebase.firestore(),
  functions: firebase.app().functions(),
  storage: firebase.storage(),
}

export const useFirebase = () => {
  const [claims, setClaims] = useState<object | null>(null)
  const [initStatus, setInitStatus] = useReducer(
    (state: object, data: object) => _.assign({}, state, data),
    { user: true }
  )

  const auth = firebase.auth()

  useEffect(() => {
    const authUnsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log(`sign in as ${user.uid}`)
        const tokenResult = await user.getIdTokenResult(true)
        tokenResult.claims
        setClaims(tokenResult.claims)
      } else {
        console.log('signed out')
        setClaims(null)
      }

      setInitStatus({ user: false })
    })

    // unsubscribe to the listener when unmounting
    return () => {
      _.forEach([authUnsub], (u) => u())
    }
  }, [auth])

  const updateClaims = async () => {
    if (!auth.currentUser) return
    const tokenResult = await auth.currentUser.getIdTokenResult(true)
    setClaims(tokenResult.claims)
  }

  // when all flags in initStatus are false, then initializing == true
  return _.defaults(
    {
      initializing: _.some(_.values(initStatus)),
      currentUser: auth.currentUser,
      claims,
      updateClaims,
    },
    FIREBASE_DEFAULTS
  )
}
