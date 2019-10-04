import React, { FC, useState } from 'react'
import { ReactSortable } from '../react-sortable/react-sortable'
import { makeState } from './functions-and-styles'

export const BasicFunction: FC = props => {
  const [state, setState] = useState<{ id: string; name: string }[]>(makeState)

  return (
    <ReactSortable list={state} setList={setState}>
      {state.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  )
}
