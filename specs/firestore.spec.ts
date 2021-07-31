import * as firebase from '@firebase/rules-unit-testing'
const { getAuthedFirestore } = require('./helpers')
const TEST_PROJECT_ID = 'test-project-id'

afterAll(async () => {
  await Promise.all(firebase.apps().map((app: any) => app.delete()))
})

afterEach(async () => {
  await firebase.clearFirestoreData({ projectId: TEST_PROJECT_ID })
})

describe('Firestore Test Sample', () => {
  test('Foo', async () => {
    const db = getAuthedFirestore()
    await firebase.assertSucceeds(db.doc('sample/foo').get())
    await firebase.assertFails(db.collection('sample').add({ foo: 'bar' }))
  })

  test('Bar', async () => {
    const db = getAuthedFirestore({ uid: 'alice' })
    await firebase.assertSucceeds(db.collection('sample').add({ foo: 'bar' }))
  })
})
