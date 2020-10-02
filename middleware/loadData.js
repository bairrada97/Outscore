export default async function ({ payload, store, from, req }) {
  await store.dispatch('getFixtures')
}
