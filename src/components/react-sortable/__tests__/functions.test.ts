import { addToState, removeFromState } from '../sortable-recursive'

const state = [
  { id: '1', name: 'shrek' },
  { id: '2', name: 'fiona' },
  { id: '3', name: 'donkey' },
  { id: '4', name: 'kingdom', children: [{ id: '8', name: 'King' }, { id: '9', name: 'Queen' }] }
]

const refItem = { id: '6', name: 'butters' }

it('adds one at 0 depth', () => {
  const r = addToState({
    state,
    refItem,
    depth: 0,
    index: 2,
    currentDepth: 0
  })
  const e = [
    { id: '1', name: 'shrek' },
    { id: '2', name: 'fiona' },
    refItem,
    { id: '3', name: 'donkey' },
    { id: '4', name: 'kingdom', children: [{ id: '8', name: 'King' }, { id: '9', name: 'Queen' }] }
  ]
  expect(r).toStrictEqual(e)
})
it('adds one at 0 depth', () => {
  const r = addToState({
    state,
    refItem,
    depth: 1,
    index: 1,
    currentDepth: 0
  })
  const e = [
    { id: '1', name: 'shrek' },
    { id: '2', name: 'fiona' },

    { id: '3', name: 'donkey' },
    {
      id: '4',
      name: 'kingdom',
      children: [{ id: '8', name: 'King' }, refItem, { id: '9', name: 'Queen' }]
    }
  ]
  expect(r).toStrictEqual(e)
})

it('removes one at 0 depth', () => {
  const r = removeFromState({
    state,
    depth: 0,
    index: 2,
    currentDepth: 0
  })
  const e = [
    { id: '1', name: 'shrek' },
    { id: '2', name: 'fiona' },
    { id: '4', name: 'kingdom', children: [{ id: '8', name: 'King' }, { id: '9', name: 'Queen' }] }
  ]
  expect(r).toStrictEqual(e)
})
it('removes one at 1 depth', () => {
  const r = removeFromState({
    state,
    depth: 1,
    index: 1,
    currentDepth: 0
  })
  const e = [
    { id: '1', name: 'shrek' },
    { id: '2', name: 'fiona' },
    { id: '3', name: 'donkey' },
    { id: '4', name: 'kingdom', children: [{ id: '8', name: 'King' }] }
  ]
  expect(r).toStrictEqual(e)
})
