# `react-sortablejs-typescript`

React component wrapping [SortableJS](https://github.com/SortableJS/Sortable) written in Typescript!

## Features to add & things to do:

- examples page in github pages.
- add a pretty picture.
- tests.
- clone function and dom change
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
yarn add react-sortablejs-typescript
```

## What you should know

- Explore the [Sortable Options API](https://github.com/SortableJS/Sortable#options)
- Array.map
- React.forwardRef

## Usage/Examples

### Function Component

```tsx
import React, { FC, useState } from 'react'
import { ReactSortable } from 'react-sortablejs-typescript'

interface ItemType {
  id: string
  name: string
}

export const BasicFunction: FC = props => {
  const [state, setState] = useState<ItemType[]>([{ id: '1', name: 'shrek' }])

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
import React, { Component } from 'react'
import { ReactSortable } from 'react-sortablejs-typescript'

interface BasicClassState {
  list: { id: string; name: string }[]
}

export class BasicClass extends Component<{}, BasicClassState> {
  state: BasicClassState = {
    list: [{ id: '1', name: 'shrek' }]
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

### Custom Component as a tag

Whatever component you put into the `tag` property, it must have a `ref` prop available.

Adding a string like `'div'` or `'ul'` works because they're passed to `React.createElement()`.
Doing the same with a `React.(Component | FC)` wil throw an error, because there is no ref.

#### Solution

If it doesn't have one, you can add one using `React.forwardRef()`.
This fantastic API allows the ref to be visible when creating components.

```tsx
import React, { FC, useState, forwardRef } from "react"
import { ReactSortable } from "react-sortablejs-typescript"

interface ItemType {
  id: string
  name: string
}

const CustomComponent = forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref}>{props.children}/<div>
})

export const BasicFunction: FC = props => {
  const [state, setState] = useState<ItemType[]>([{ id: "1", name: "shrek" }])

  return (
    <ReactSortable tag={CustomComponent} list={state} setList={setState}>
      {state.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  )
}
```

## How does it work?

Sortable affects the DOM, adding, and removing nodes when it needs to in order to achieve the smooth transitions we all know an love. The plugin reverses any actions the DOM makes and allows React to handle this when the state changes.

## Caveats / Gotchas

### `setState()`

#### Problem

`setState` takes one argument only. If we look in the type defs, it does say that it has a second argument, but it isalready deprecated. react-sortable-typescript passes three arguments to `setState`. If you pass the `setState` straight from a `useState` hook, it will work as expected. However, there will be a warning in the console:

> Warning: State updates from the useState() and useReducer() Hooks don't support the second callback argument.
> To execute a side effect after rendering, declare it in the component body with useEffect().

#### Solution

This is just a warning, but can be annoying when developing. Instead of passing `setState` in directly, be explicit in your callback:

```tsx
import React, { FC, useState } from 'react'
import { ReactSortable } from 'react-sortablejs-typescript'

interface ItemType {
  id: string
  name: string
}

export const BasicFunction: FC = props => {
  const [state, setState] = useState<ItemType[]>([{ id: '1', name: 'shrek' }])

  return (
    // `sortable` and `store` are here just to show what arguments have been passed.
    // They are not required to be used.
    <ReactSortable list={state} setList={(newState, sortable, store) => setState(newState)}>
      {state.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  )
}
```



From the react type definitions:

> ```tsx
> // this technically does accept a second argument, but it's already under a deprecation warning
> // and it's not even released so probably better to not define it.
> ```

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
