import React from 'react'
import { useState, FC } from 'react'
import { makeState, List, NodeLike } from '../examples/functions-and-styles'
import { removeNode } from '../react-sortable/util'
import { Item, ReactSortableNested } from './react-sortable-nested'

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
      onAdd={() => console.log('add')}
      onRemove={() => console.log('remove')}
      onUpdate={() => console.log('update')}
      animation={200}
      list={state}
      setList={setState}
      // clone needs to be handled
      // use this in my react sortable nested component
      group={{
        name: 'group',
        pull: (to, from) => {
          const togo = to.options.group
          const toName = typeof togo === 'object' ? togo.name : togo
          const fromgo = from.options.group
          const fromName = typeof fromgo === 'object' ? fromgo.name : fromgo
          const clone = true
          const pullval = fromName || true
          return typeof pullval === 'boolean' ? !!pullval : [pullval]
        },
        put: true
      }}
      swapThreshold={0.5}
      removeOnSpill
      // need to add to react sortable component
      onSpill={evt => {
        removeNode(evt.item)
      }}
      // triggers immediately when function returns
      onClone={evt => {
        console.log('cloned')
      }}
    >
      {({ item, Nested, path, index, depth }) => (
        <List>
          <NodeLike>
            <div>
              <b>{item.name}</b>
            </div>
            <div>
              <code>PATH: {JSON.stringify(path)}, </code>
              <code>
                DEPTH: {depth}, INDEX: {index}
              </code>
            </div>
            <Nested />
          </NodeLike>
        </List>
      )}
    </ReactSortableNested>
  )
}
