import * as firebase from '@firebase/rules-unit-testing'
const TEST_PROJECT_ID = 'test-project-id'

export const getAuthedFirestore = (auth: object | undefined = undefined) => {
  return firebase
    .initializeTestApp({ projectId: TEST_PROJECT_ID, auth })
    .firestore()
}
