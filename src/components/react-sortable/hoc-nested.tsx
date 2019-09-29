import React, { createContext, ReactElement, ReactNode } from 'react'
import { ReactSortableNestedProps, ReactSortableNested } from './react-sortable-nested'
import { Item } from '.'

export function SortableHOCnested<T extends Item>(props: SortableHOCnestedProps<T>) {
  const { list, setList, ...otherProps } = props
  return (
    <SortableProvider rootState={list} setRootState={setList}>
      <ReactSortableNested list={list} depth={0} {...otherProps} />
    </SortableProvider>
  )
}

export interface SortableHOCnestedProps<T extends Item>
  extends Omit<ReactSortableNestedProps<T>, 'depth' | 'rootList' | 'setRootList'> {
  // react sortable
  list: T[]
  setList: (newState: T[]) => void
}

//@ts-ignore
export const sortableContext = createContext<ofthis<Item>>({})

interface ofthis<T extends Item> {
  rootState: T[]
  setRootState: (newState: T[]) => void
}

export function SortableProvider<T extends Item>(
  props: ofthis<T> & Readonly<{ children?: ReactNode }>
): ReactElement {
  const { children, ...rest } = props
  return <sortableContext.Provider value={rest}>{children}</sortableContext.Provider>
}
