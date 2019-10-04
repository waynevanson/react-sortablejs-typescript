import { replaceList } from '../sortable-recursive'
import { Item } from '../react-sortable-nested'

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

const contexPath: Item[] = [
  { id: '6', name: 'butters', children: [] },
  { id: '7', name: 'cherries', children: [] }
]

describe(replaceList, () => {
  it('should work', () => {
      const e: Item[] = [
        { id: '1', name: 'shrek', children: [] },
        { id: '2', name: 'fiona', children: [] },
        { id: '3', name: 'donkey', children: [] },
        {
          id: '4',
          name: 'kingdom',
          children: contexPath
        }
      ]
    const r = replaceList(state, e, [3], '4')
    expect(r).toEqual(e)
  })
})
