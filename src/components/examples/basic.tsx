import React, { FC, useState } from 'react'
import { ReactSortable, Item } from '../react-sortable/react-sortable'
import { makeState, List, Node } from './functions-and-styles'
import styled from 'styled-components'
import { SortableHOCnested } from '../react-sortable/hoc-nested'

export const Basic: FC = props => {
  const [state, setState] = useState<Item[]>(makeState)

  return (
    <ReactSortable list={state} setList={state => setState(state)}>
      {/* For each item in the list, return an element */}
      {state.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  )
}

export const BasicWithTag: FC = props => {
  const [state, setState] = useState<Item[]>(makeState)

  return (
    <ReactSortable tag="ul" list={state} setList={setState}>
      {state.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ReactSortable>
  )
}

const Comp = styled.code``

export const BasicWithCustomTag: FC = props => {
  const [state, setState] = useState<Item[]>(makeState)

  return (
    <ReactSortable tag={Comp} list={state} setList={setState}>
      {state.map(item => (
        <span key={item.id}>{item.name}&nbsp;</span>
      ))}
    </ReactSortable>
  )
}

export const NestedExample: FC = props => {
  const [state, setState] = useState<Item[]>([
    ...makeState(),
    {
      id: '7',
      name: 'far far away',
      children: [{ id: '8', name: 'King' }, { id: '9', name: 'Queen' }]
    }
  ])
  console.log({ state })
  return (
    <SortableHOCnested list={state} setList={setState} group="groupname" swapThreshold={0.65}>
      {(item, Nested) => (
        <List>
          <Node>
            {item.name}

            <Nested />
          </Node>
        </List>
      )}
    </SortableHOCnested>
  )
}
