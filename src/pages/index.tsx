import React, { useContext } from 'react'
import { FirebaseContext } from '../lib/contexts'
import Head from 'next/head'
import { Button, Typography, Container } from '@material-ui/core'

const AuthButton: React.FC = () => {
  const { auth, currentUser, firebase } = useContext(FirebaseContext)

  if (currentUser)
    return (
      <Button variant='contained' onClick={() => auth.signOut()}>
        Sign Out
      </Button>
    )

  return (
    <Button
      variant='contained'
      onClick={() => {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithRedirect(provider)
      }}>
      Sign In
    </Button>
  )
}

export default function Home() {
  return (
    <Container style={{ marginTop: 200, textAlign: 'center' }}>
      <Head>
        <title>Firebase NextJS Template</title>
      </Head>

      <Typography style={{ marginBottom: 20 }} variant='body1'>
        This is HOME
      </Typography>

      <AuthButton />
    </Container>
  )
}
