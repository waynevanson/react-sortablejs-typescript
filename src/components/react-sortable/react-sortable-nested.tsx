import React, { Dispatch, SetStateAction } from 'react'
import { SortableRecursiveProps, SortableRecursive } from './sortable-recursive'
import { Item } from '.'

export function ReactSortableNested<T extends Item>(props: ReactSortableNestedProps<T>) {
  const { list, setList, ...otherProps } = props
  return <SortableRecursive setRootState={setList} list={list} depth={0} {...otherProps} />
}

export interface ReactSortableNestedProps<T extends Item>
  extends Omit<SortableRecursiveProps<T>, 'depth' | 'rootState' | 'setRootState'> {
  /**
   * A list of items, should have be an OBJECT and have and ID, with children optional
   */
  list: T[]
  /**
   * The setState function
   */
  setList: Dispatch<SetStateAction<T[]>>
}

/**
 * This is the recommended list item type.
 * implement or extend this when creating your own.
 */
export interface Item {
  id: string
  children?: Item[]
  [key: string]: any
}
