import React, { FC, ReactElement, cloneElement } from 'react'
import { ReactSortable, ReactSortableProps, SetStateCallback } from '../react-sortable'
import { GroupOptions } from 'sortablejs'
import { useSorting, useHandlers } from './hooks'
import { Item } from '..'

/**
 * State is managed for you, so relax!
 *
 * @param props
 */
export function SortableRecursive<T extends Item>(props: SortableRecursiveProps<T>) {
  const { children, list, depth: propDepth, setRootState, ...options } = props
  const depth = propDepth || 0

  const sorting = useSorting(props, depth)
  const handlers = useHandlers(props, sorting)

  return (
    <ReactSortable uncontrolled {...options} {...handlers} list={list}>
      {list.map(item => {
        // todo:
        // allow a ref?
        // parse details like `depth` and `index` and `path` to the `children` function
        const Nested = () => (
          <SortableRecursive
            {...props}
            children={children}
            depth={depth + 1}
            //@ts-ignore
            list={item.children || []}
          />
        )
        return cloneElement(children(item, Nested), { key: item.id })
      })}
    </ReactSortable>
  )
}

export interface SortableRecursiveProps<T extends Item>
  extends Omit<ReactSortableProps<T>, 'setList' | 'children'> {

  // nested sortable
  children: ReactSortableChildren<T>
  depth: number
  list: T[]

  setRootState: SetStateCallback<T[]>

  // react sortable
  // options
  group: string | GroupOptions
  swapThreshold: number
}

export interface ReactSortableChildren<T extends Item> {
  (item: T, Nested: FC): ReactElement
}
