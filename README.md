# `react-sortablejs-typescript`
React component wrapping SortableJS written in Typescript!

## todo:

- readme.
- tests.
- clone function.
- provide a context wrapper for `store` object, to enhance security.

## Features

- [x] Typescript support & updated @types/sortablejs definitions
- [x] Drag and Drop between lists
- [x] Calculates items in list automatically
- [x] Full API of SortableJS
- [x] Convenient SortableJS API via `props`
- [x] Compatible with third part UI libraries
- [x] SortableJS Plugin Support

If you find any features lacking, create an issue and/or pull request.

## Installation

```shell
npm install -s react-sortablejs-typescript
# OR
yarn install react-sortablejs-typescript
```

## Usage/Examples

### Function Component

```tsx
import React, { FC, useState } from "react"
import { ReactSortable } from "react-sortablejs-typescript"

interface ItemType {
  id: string
  name: string
}

export const BasicFunction: FC = props => {
  const [state, setState] = useState<ItemType[]>([{ id: "1", name: "shrek" }])

  return (
    <ReactSortable list={state} setList={setState}>
      {state.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  )
}
```

### Class Component

```tsx
import React, { Component } from "react"
import { ReactSortable } from "react-sortablejs-typescript"

interface BasicClassState {
  list: { id: string; name: string }[]
}

export class BasicClass extends Component<{}, BasicClassState> {
  state: BasicClassState = {
    list: [{ id: "1", name: "shrek" }]
  }
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
```

## Upgrading to Major Version `+2.0.0`

We've gone out of our way to make this component more like a react component, rather than just a wrapper.
This means there are huge changes in the way props should be use in React. Because it's written in Typescript, the API should be available in your IDE. We're also added a lot of typings from `types/sortablejs` and looking to push those once we've written tests for them. I'd like to see the JSDocs tags used to their full extent, but that's a work in progress.

All of the `Sortable.Options` are now props in `react-sortablejs`, and will be merged with the actual options in the Sortable instance.

## How does it work?

Sortable affects the DOM, adding, and removing nodes when it needs to in order to achieve the smooth transitions we all know an love.

## Caveats / Gotchas

### Nesting

#### Problem

When moving items in between layers of the same list, it does not rerender the UI properly.

Nesting in this fashion is not ready for production.
React is based of functional programming philosphies,
where as the DOM and most other web API's are object oriented.

This means that using `state` and `setState` are causing issues when the sortable API triggers a state change.

#### What does work?

Our usage indicates that as long as we only move items between lists that don't use the same `setState` function.

I hope to provide an example soon.

#### Solutions

We don't have anything that works 100%, but here I'd like to spit ball some potential avenues to look down.

- Use `onMove` to handle state changes instead of `onAdd`,`onRemove`, etc.
- Create a Sortable plugin specifically for react-sortbalejs
