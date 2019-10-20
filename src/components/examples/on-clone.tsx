import React, { FC, useState } from 'react'
import { makeState } from './functions-and-styles'
import { ReactSortable } from '../react-sortable'

export const OnCloneComponent: FC = props => {
  const [state, setState] = useState<{ id: string; name: string }[]>(makeState)
  const [state1, setState1] = useState<{ id: string; name: string }[]>([
    { id: '4', name: 'king' },
    { id: '5', name: 'queen' }
  ])

  return (
    <div>
      <ReactSortable
        clone={oldItem => ({ ...oldItem, id: '69' })}
        group={{ name: 'shared', pull: 'clone' }}
        list={state}
        setList={setState}
      >
        {state.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </ReactSortable>
      <ReactSortable group="shared" list={state1} setList={setState1}>
        {state1.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </ReactSortable>
    </div>
  )
}
