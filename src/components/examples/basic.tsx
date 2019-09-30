import React, { FC, useState } from 'react'
import { ReactSortable, Item } from '../react-sortable/react-sortable'
import { makeState, List, NodeLike } from './functions-and-styles'
import styled from 'styled-components'
import { ReactSortableNested } from '../react-sortable/react-sortable-nested'

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

// export const BasicWithTag: FC = props => {
//   const [state, setState] = useState<Item[]>(makeState)

//   return (
//     <ReactSortable tag="ul" list={state} setList={setState}>
//       {state.map(item => (
//         <li key={item.id}>{item.name}</li>
//       ))}
//     </ReactSortable>
//   )
// }

// const Comp = styled.code``

// export const BasicWithCustomTag: FC = props => {
//   const [state, setState] = useState<Item[]>(makeState)

//   return (
//     <ReactSortable tag={Comp} list={state} setList={setState}>
//       {state.map(item => (
//         <span key={item.id}>{item.name}&nbsp;</span>
//       ))}
//     </ReactSortable>
//   )
// }

