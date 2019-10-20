import React, { useState } from 'react'
import styled from 'styled-components'
import { MultiDrag, ReactSortable } from '../react-sortable'

export function MultiDragComponent() {
  const [state, setState] = useState([
    { id: '1', name: 'shrek' },
    { id: '2', name: 'fiona' },
    { id: '3', name: 'donkey' }
  ])
  return (
    <ReactSortable
      animation={100}
      group="penis"
      multiDragKey="control"
      multiDrag
      tag="div"
      list={state}
      setList={setState}
      plugins={new MultiDrag()}
    >
      {state.map(item => (
        <MyItem style={{ padding: '20px' }} key={item.id}>
          {item.name}
        </MyItem>
      ))}
    </ReactSortable>
  )
}

const MyItem = styled.div`
  background-color: #ccc;
  padding: 0.5rem;
  &.sortable-selected {
    background-color: #ffaaaa;
  }
`
