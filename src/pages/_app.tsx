import React, { useContext } from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CssBaseline, Backdrop, CircularProgress } from '@material-ui/core'

import { FirebaseContext } from '../lib/contexts'
import { useFirebase } from '../lib/contexts'

// Wait until initialized
const FirebaseInitWrapper = ({ children }: { children: any }) => {
  const { initializing } = useContext(FirebaseContext)
  if (initializing)
    return (
      <Backdrop open>
        <CircularProgress color='inherit' />
      </Backdrop>
    )

  return children
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseContext.Provider value={useFirebase()}>
      <FirebaseInitWrapper>
        <CssBaseline />
        <Component {...pageProps} />
      </FirebaseInitWrapper>
    </FirebaseContext.Provider>
  )
}
export default MyApp
