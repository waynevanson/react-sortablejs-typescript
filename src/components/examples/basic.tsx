import React, { FC, useState } from 'react'
import { ReactSortable } from '../react-sortable/react-sortable'
import { makeState } from './functions-and-styles'
import { Item } from '../react-sortable/react-sortable-nested'

export const Basic: FC = props => {
  const [state, setState] = useState<Item[]>(makeState)

  /* For each item in the list, return an element */
  return (
    <ReactSortable list={state} setList={state => setState(state)}>
      {state.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  )
}
