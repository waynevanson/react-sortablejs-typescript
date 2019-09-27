import React, { FC, ReactElement, cloneElement } from 'react'
import { ReactSortable, Item, ReactSortableProps } from './react-sortable'

import { GroupOptions } from 'sortablejs'

export function ReactSortableNested<T extends Item>(props: ReactSortableNestedProps<T>) {
  const { children, state, setState, ...options } = props

  function handleNestedChange(id: string) {
    return (newChildren: T[]) => {
      const newState = [...state]
      const index = newState.findIndex(i => i.id === id)
      const newItem: T = {
        ...newState[index],
        children: newChildren
      }
      newState.splice(index, 1, newItem)
      setState(newState)
    }
  }

  return (
    <ReactSortable {...options} state={state} setState={setState}>
      {state.map(item => {
        const rendered = children(item, () => (
          <ReactSortableNested
            {...options}
            children={children}
            //@ts-ignore
            state={item.children || ([] as T[])}
            setState={handleNestedChange(item.id)}
          />
        ))
        // needed to add a key to the element
        return cloneElement(rendered, { key: item.id })
      })}
    </ReactSortable>
  )
}

export interface ReactSortableNestedProps<T> extends ReactSortableProps<T> {
  // nested sortable
  children: (item: T, Nested: FC) => ReactElement

  // react sortable
  state: T[]

  // options
  group: string | GroupOptions
  swapThreshold: number
}
