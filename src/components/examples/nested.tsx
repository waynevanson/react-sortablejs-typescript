import React from 'react'
import { useState, FC } from 'react'
import { Item, ReactSortableNested } from '../react-sortable'
import { makeState, List, NodeLike } from './functions-and-styles'

export const NestedExample: FC = props => {
  const [state, setState] = useState<Item[]>([
    ...makeState(),
    {
      id: '7',
      name: 'far far away',
      children: [{ id: '8', name: 'King', children: [] }, { id: '9', name: 'Queen', children: [] }]
    }
  ])
  return (
    <ReactSortableNested
      easing="step-end"
      animation={200}
      list={state}
      setList={setState}
      group="groupname"
      swapThreshold={0.5}
    >
      {(item, Nested) => (
        <List>
          <NodeLike>
            {item.name}
            <Nested />
          </NodeLike>
        </List>
      )}
    </ReactSortableNested>
  )
}
