import React, { useState, Children } from 'react'
import { Item, ReactSortable } from './components'
import { Nested } from './examples/nested'

const App: React.FC = () => {
  const [state, setState] = useState(makeState)
  return <Nested state={state} setState={setState} />
}

export default App

const makeState = () =>
  [
    { id: '1', name: 'shrek' },
    {
      id: '2',
      name: 'fiona',
      children: [{ id: '5', name: 'dicks' }, { id: '6', name: 'mateabag' }]
    }
  ] as Item[]
