import React, { FC, ReactElement, cloneElement } from 'react'
import { ReactSortable, ReactSortableProps, SetStateCallback } from '../react-sortable'
import { GroupOptions } from 'sortablejs'
import { Item } from '..'

/**
 * State is managed for you, so relax!
 *
 * @param props
 */
export function SortableRecursive<T extends Item>(props: SortableRecursiveProps<T>) {
  const { children, list, depth: propDepth, setList, ...options } = props
  const depth = propDepth || 0

  const handleChildChange = (index: number): SetStateCallback<T[]> => prevChildrenFunc => {
    setList(prevList => {
      const newList = [...prevList]
      const prevItem = newList[index]
      const children = prevChildrenFunc(prevItem.children as T[])
      const newItem: T = { ...prevItem, children }
      newList.splice(index, 1, newItem)
      return newList
    })
  }

  return (
    <ReactSortable {...options} setList={setList} list={list}>
      {list.map((item, index) => {
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
            setList={handleChildChange(index)}
          />
        )
        return cloneElement(children(item, Nested), { key: item.id })
      })}
    </ReactSortable>
  )
}

export interface SortableRecursiveProps<T extends Item>
  extends Omit<ReactSortableProps<T>, 'children'> {
  // nested sortable
  children: ReactSortableChildren<T>
  depth: number
  list: T[]
  setList: SetStateCallback<T[]>

  setRootState: SetStateCallback<T[]>

  // react sortable
  // options
  group: string | GroupOptions
  swapThreshold: number
}

export interface ReactSortableChildren<T extends Item> {
  (item: T, Nested: FC): ReactElement
}
