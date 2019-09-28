import React, { FC, ReactElement, cloneElement, useState } from 'react'
import { ReactSortable, Item, ReactSortableProps } from './react-sortable'

import { GroupOptions } from 'sortablejs'

export function ReactSortableNested<T extends Item>(props: ReactSortableNestedProps<T>) {
  const { children, state, setState, ...options } = props

  const [handleNestedChange, ...hook] = useItemChildren({ state })
// I think i need to use the classic recursion method for this. 
// nested state change just aint gonna cut it
  // error handling for bad renders
  if (!state) return null
  return (
    // parse id and the children

    // component puts child in it
    <ReactSortable {...options} stateFromAChild={hook} state={state} setState={setState}>
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

interface UseMeParams<T extends Item> {
  state: T[]
}

export type ItemChildrenState<T extends Item> = [string, T[]] | null
export type UseItemChildren<T extends Item> = [
  (id: string) => (newChildren: T[]) => void,
  ItemChildrenState<T>,
  (newItemChildren: ItemChildrenState<T>) => void
]
export type UseItemChildrenHooks<T extends Item> = [
  ItemChildrenState<T>,
  (newItemChildren: ItemChildrenState<T>) => void
]

function useItemChildren<T extends Item>(params: UseMeParams<T>): UseItemChildren<T> {
  const { state } = params
  const [itemChildren, setItemChildren] = useState<ItemChildrenState<T>>(null)
  const handleNestedChange = (id: string) => (newChildren: T[]) => {
    setItemChildren([id, newChildren])
  }

  return [handleNestedChange, itemChildren, setItemChildren]
}

export interface ReactSortableNestedProps<T extends Item> extends ReactSortableProps<T> {
  // nested sortable
  children: (item: T, Nested: FC) => ReactElement
  // react sortable
  state: T[]

  // options
  group: string | GroupOptions
  swapThreshold: number
}
