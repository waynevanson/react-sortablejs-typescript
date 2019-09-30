import { addToState, removeFromState } from './hooks'
import { Item } from '..'

const state: Item[] = [
  { id: '1', name: 'shrek', children: [] },
  { id: '2', name: 'fiona', children: [] },
  { id: '3', name: 'donkey', children: [] },
  {
    id: '4',
    name: 'kingdom',
    children: [{ id: '8', name: 'King', children: [] }, { id: '9', name: 'Queen', children: [] }]
  }
]

const refItem: Item = { id: '6', name: 'butters', children: [] }

describe(addToState, () => {
  it.todo('')
})
describe(removeFromState, () => {})
