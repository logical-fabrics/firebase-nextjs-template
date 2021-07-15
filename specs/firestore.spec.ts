const firebase = require('@firebase/rules-unit-testing')
const { getAuthedFirestore } = require('./helpers')
const { PROJECT_ID } = process.env

afterAll(async () => {
  await Promise.all(firebase.apps().map((app: any) => app.delete()))
})

afterEach(async () => {
  await firebase.clearFirestoreData({ projectId: PROJECT_ID })
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
