import React, { useState } from 'react'
import { ReactSortable, MultiDrag } from '../react-sortable'
import './multidrag.css'

export function MultiDragComponent() {
  const [state, setState] = useState([
    { id: '1', name: 'shrek' },
    { id: '2', name: 'fiona' },
    { id: '3', name: 'donkey' }
  ])
  return (
    <ReactSortable
      selectedClass="selected-class"
      animation={100}
      group="penis"
      multiDragKey="ctrl"
      multiDrag
      tag="div"
      list={state}
      setList={setState}
      plugins={new MultiDrag()}
    >
      {state.map(item => (
        <div style={{padding: '20px'}} key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  )
}
