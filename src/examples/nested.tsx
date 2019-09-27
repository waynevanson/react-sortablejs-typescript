import React, { FC, ReactNode } from 'react'
import { ReactSortable, Item } from '../components'

import styled from 'styled-components'

export const Nested: FC<NestedProps> = props => {
  const { children, indent, state, setState } = props

  function handleNestedChange(id: string) {
    return (newChildren: Item[]) => {
      const index = state.findIndex(i => i.id === id)
      const newItem: Item = { ...state[index], children: newChildren }
      const newState = [...state]
      newState.splice(index, 1, newItem)
      setState(newState)
    }
  }

  const marginLeft = indent && state.length > 0 ? '25px' : '0px'
  return (
    <Row>
      <ReactSortable
        style={{
          marginLeft,
          display: 'flex',
          flexDirection: 'column'
        }}

        animation={200}
        group="yes"
        state={state}
        setState={setState}
        fallbackOnBody
      >
        {state.length > 0 ? (
          state.map(item => (
            <Column key={item.id}>
              {children ? children(item) : <Row>{item.name}</Row>}
              <Nested indent state={item.children || []} setState={handleNestedChange(item.id)} />
            </Column>
          ))
        ) : (
          <ReactSortable state={[]} setState={() => {}} />
        )}
      </ReactSortable>
    </Row>
  )
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
`
const Row = styled.div`
  display: flex;
  border: solid 1px black;
  width: 400;
`

interface NestedProps {
  children?: (item: Item) => ReactNode
  state: Item[]
  setState: (newState: Item[]) => void
  indent?: boolean
}
