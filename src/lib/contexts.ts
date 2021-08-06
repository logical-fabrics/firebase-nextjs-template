import _ from 'lodash'
import firebase from './firebase'
import {
  createContext,
  useEffect,
  useState,
  useReducer,
  useContext,
} from 'react'

//
// FirebaseContext
//
interface UseFirebase {
  firebase: typeof firebase
  auth: firebase.auth.Auth
  db: firebase.firestore.Firestore
  functions: firebase.functions.Functions
  storage: firebase.storage.Storage
  initializing?: boolean
  currentUser?: firebase.User
  claims?: object | null
  updateClaims?: () => Promise<void>
}

export const FirebaseContext = createContext<UseFirebase>({
  firebase,
  auth: firebase.auth(),
  db: firebase.firestore(),
  functions: firebase.app().functions(),
  storage: firebase.storage(),
})

export const useFirebase = () => {
  const firebaseContext = useContext(FirebaseContext)
  const { auth } = firebaseContext
  const [claims, setClaims] = useState<object | null>(null)
  const [initStatus, setInitStatus] = useReducer(
    (state: object, data: object) => _.assign({}, state, data),
    { user: true }
  )

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
  return _.assign({}, firebaseContext, {
    initializing: _.some(_.values(initStatus)),
    currentUser: auth.currentUser,
    claims,
    updateClaims,
  })
}
