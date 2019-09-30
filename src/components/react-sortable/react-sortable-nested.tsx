import React, { Dispatch, SetStateAction, FC, ReactElement } from 'react'
import { Item, SortableRecursiveProps, SortableRecursive } from '.'

export function ReactSortableNested<T extends Item>(props: SortableHOCnestedProps<T>) {
  const { list, setList, ...otherProps } = props
  return <SortableRecursive setRootState={setList} list={list} depth={0} {...otherProps} />
}

export interface SortableHOCnestedProps<T extends Item>
  extends Omit<SortableRecursiveProps<T>, 'depth' | 'rootState' | 'setRootState'> {
  children: (item: T, Nested: FC) => ReactElement
  /**
   * A list of items, should have be an OBJECT and have and ID, with children optional
   */
  list: T[]
  /**
   * The setState function
   */
  setList: Dispatch<SetStateAction<T[]>>
}
