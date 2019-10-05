import React, { Component } from 'react'
import { ReactSortable } from '../react-sortable'

interface BasicClassState {
  list: { id: string; name: string }[]
}

export class BasicClass extends Component<{}, BasicClassState> {
  /* For each item in the list, return an element */
  state: BasicClassState = { list: [{ id: '1', name: 'shrek' }, { id: '2', name: 'fiona' }] }
  render() {
    return (
      <ReactSortable list={this.state.list} setList={newState => this.setState({ list: newState })}>
        {this.state.list.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </ReactSortable>
    )
  }
}
