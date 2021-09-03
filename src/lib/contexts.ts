import _ from 'lodash'
import { getAuth, Auth, User } from '@firebase/auth'
import { getFirestore, Firestore } from '@firebase/firestore'
import { getFunctions, Functions } from '@firebase/functions'
import { getStorage, FirebaseStorage } from '@firebase/storage'
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
  auth: Auth
  db: Firestore
  functions: Functions
  storage: FirebaseStorage
  initializing?: boolean
  currentUser?: User
  claims?: object | null
  updateClaims?: () => Promise<void>
}

export const FirebaseContext = createContext<UseFirebase>({
  auth: getAuth(),
  db: getFirestore(),
  functions: getFunctions(),
  storage: getStorage(),
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
