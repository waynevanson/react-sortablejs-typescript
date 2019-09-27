import React, { FC, useState, Component, createRef, RefObject } from 'react'
import { ReactSortable, Item } from '../react-sortable/react-sortable'
import { makeState, List, Node } from './functions-and-styles'
import styled from 'styled-components'
import { ReactSortableNested } from '../react-sortable/react-sortable-nested'
import Sortable from 'sortablejs'

export const Basic: FC = props => {
  const [state, setState] = useState<Item[]>(makeState)

  return (
    <ReactSortable state={state} setState={setState}>
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
    <ReactSortable tag="ul" state={state} setState={setState}>
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
    <ReactSortable tag={Comp} state={state} setState={setState}>
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

  return (
    <ReactSortableNested
      tag={List}
      group="shreeeek"
      swapThreshold={0.55}
      animation={200}
      state={state}
      setState={setState}
      children={(item, Nested) => (
        <Node>
          {item.name}
          <Nested />
        </Node>
      )}
    />
  )
}

export class NestedListsClass extends Component {
  ref1: RefObject<HTMLDivElement>

  ref2000: RefObject<HTMLDivElement>
  constructor(props: any) {
    super(props)
    this.ref1 = createRef()
    this.ref2000 = createRef()
  }

  componentDidMount() {
    const ss = [this.ref1, this.ref2000]
    ss.forEach(
      r =>
        r.current !== null &&
        Sortable.create(r.current, {
          animation: 300,
          group: 'name',
          swapThreshold: 0.3,
          invertSwap: true,
          fallbackOnBody: true
        })
    )
  }
  render() {
    return (
      <List ref={this.ref1}>
        <Node>ONE</Node>
        <Node>
          TWO
          <List ref={this.ref2000}>
            <Node>4OUR</Node>
            <Node>5IVE</Node>
          </List>
        </Node>
        <Node>THREE</Node>
      </List>
    )
  }
}
