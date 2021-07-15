const firebase = require('@firebase/rules-unit-testing')
const { PROJECT_ID } = process.env

export const getAuthedFirestore = (auth: object | undefined = undefined) => {
  return firebase.initializeTestApp({ projectId: PROJECT_ID, auth }).firestore()
}
