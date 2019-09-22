import React, { FC } from 'react'
import { ReactSortable, Item } from '../components'

import styled from 'styled-components'

export const Nested: FC<NestedProps> = props => {
  const { children, indent, ...otherProps } = props
  const { state, setState } = props

  function handleNestedChange(id: string) {
    return (newChildren: Item[]) => {
      const index = state.findIndex(i => i.id === id)
      const newItem: Item = { ...state[index], children: newChildren }
      const newState = [...state]
      newState.splice(index, 1, newItem)
      setState(newState)
    }
  }

  // how toget nested to drag a nest properly?
  return (
    <Row>
      <ReactSortable
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: indent && state.length > 0 ? '25px' : '0px'
        }}
        {...otherProps}
        groupOptions={{ name: 'shared' }}
        options={{ animation: 200 }}
      >
        {state.length > 0 ? (
          state.map(item => (
            <Column key={item.id}>
              <Row>{item.name}</Row>
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
  state: Item[]
  setState: (newState: Item[]) => void
  indent?: boolean
}

const S: FC = props => {
  return <ReactSortable
    onAdd
  ></ReactSortable>
}
