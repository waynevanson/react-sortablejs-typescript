import React, { Dispatch, SetStateAction } from 'react'
import { SortableRecursiveProps, SortableRecursive } from './sortable-recursive'

// it's not rendering some updates correctly.
// maybe it's not the best thing ever.
// todo:
// callback in reactsortable should be of that crazy nature.
// a callback in the setstate, but I can retrieve the prevstate and the list values

// todo:
// a lot of stuff lol
/**
 * *** USE AT OWN RISK ***
 * 
 * This doesn't work properly yet, and it may not ever.
 * 
 * firing two events that affect the same state don't trigger rerenders properly.
 * @param props 
 */
export function ReactSortableNested<T extends Item>(props: ReactSortableNestedProps<T>) {
  const { list, setList, ...otherProps } = props
  console.log({list})

  return (
    <SortableRecursive
      path={[]}
      setList={setList}
      list={list}
      {...otherProps}
    />
  )
}

export interface ReactSortableNestedProps<T extends Item>
  extends Omit<SortableRecursiveProps<T>, 'rootState' | 'setRootState' | 'path'> {
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
  children: Item[]
  [key: string]: any
}
