import React, {
  FC,
  ReactElement,
  cloneElement,
  Dispatch,
  SetStateAction,
  useState,
  useCallback
} from 'react'
import { ReactSortable, ReactSortableProps } from '../../react-sortable/react-sortable'
import { GroupOptions } from 'sortablejs'
import { Item } from '../react-sortable-nested'

/**
 * State is managed for you, so relax!
 *
 * @param props
 */
export function SortableRecursive<T extends Item>(props: SortableRecursiveProps<T>) {
  const { children, list, path: oldPath, setList, ...options } = props
  const handleChildChange = useHandleChild(props)
  return (
    //@ts-ignore
    <ReactSortable {...options} setList={setList} list={list}>
      {list.map((item, index) => {
        const path = [...oldPath, index]
        // todo:
        // allow a ref?
        const Nested = () => (
          <SortableRecursive
            {...props}
            children={children}
            path={path}
            //@ts-ignore
            list={item.children || []}
            setList={handleChildChange(item.id, path)}
          />
        )

        const component = children({
          item,
          Nested,
          index,
          list,
          path,
          depth: path.length
        })

        return cloneElement(component, { key: item.id })
      })}
    </ReactSortable>
  )
}

export function useForceUpdate() {
  const [, setFake] = useState({})
  const callback = useCallback(() => setFake({}), [])
  return callback
}

export function useHandleChild<T extends Item>(props: SortableRecursiveProps<T>) {
  const { setList } = props
  const forceUpdate = useForceUpdate()
  return (id: string, path: number[]): Dispatch<SetStateAction<T[]>> => children => {
    //@ts-ignore
    setList(prevList => {
      // contains this list; parents of the item
      const newContextList = findListById(prevList, path, id)
      console.log({ newContextList })
      if (!newContextList) {
        console.error('new context list was not found.')
        return prevList
      }
      // make the new item
      const index = newContextList.findIndex(item => item.id === id)
      //@ts-ignore
      const newItem: T = {
        ...newContextList[index],
        children
      }

      newContextList.splice(index, 1, newItem)

      const newList = replaceList(prevList, newContextList, path, newItem.id)
      return newList
    })
    forceUpdate()
  }
}

export function findListById<T extends Item>(
  rootState: T[],
  path: number[],
  id: string,
  d: number = 0
): T[] | undefined {
  // parent depth and index, not the end path
  const depth = path.length - 1

  for (const item of rootState) {
    const matchesDepth = depth === d
    //@ts-ignore
    if (matchesDepth && item.id === id) return rootState
    const children = findListById(item.children, path, id, d + 1)
    //@ts-ignore
    if (children) return children
  }
  return
}
// lower case variable names are "current" values for the loop
export function replaceList<T extends Item>(
  rootState: T[],
  newContextState: T[],
  // use path - 1
  path: number[],
  id: string,
  d: number = 0
): T[] {
  const newList: T[] = []
  // parent depth and index, not the end path
  const depth = path.length - 1
  for (const item of rootState) {
    const matchesDepth = depth === d
    const matchesId = item.id === id
    if (matchesId && matchesDepth) return newContextState
    const children = replaceList(item.children, newContextState, path, id, d + 1)
    const newItem = { ...item, children }
    newList.push(newItem)
  }
  return rootState
}

export interface SortableRecursiveProps<T extends Item>
  extends Omit<ReactSortableProps<T>, 'children' | 'setList'> {
  // nested sortable
  children: ReactSortableChildren<T>
  path: number[]
  list: T[]
  setList: (newState: T[]) => void

  // react sortable
  // options
  group: string | GroupOptions
  swapThreshold: number
}

export interface ReactSortableChildren<T extends Item> {
  (params: ReactSortableChildrenProps<T>): ReactElement
}

export interface ReactSortableChildrenProps<T extends Item> {
  list: T[]
  item: T
  Nested: FC
  depth: number
  index: number
  path: number[]
}
