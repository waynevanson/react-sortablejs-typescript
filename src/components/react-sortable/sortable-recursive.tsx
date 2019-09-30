import React, { FC, ReactElement, cloneElement } from 'react'
import { ReactSortable, Item, ReactSortableProps, Store, SetStateCallback } from './react-sortable'
import { GroupOptions, SortableEvent } from 'sortablejs'
import { NestedExample } from '../examples/nested'

export type ActionHandlers = Record<
  'onAdd' | 'onRemove' | 'onUpdate',
  (evt: SortableEvent, store: Store) => void
>

/**
 * State is managed for you, so relax!
 *
 * I'm trying but I'm a bees dick away
 *
 * @param props
 */
export function SortableRecursive<T extends Item>(props: SortableRecursiveProps<T>) {
  const { children, list, depth: propDepth, setRootState, ...options } = props
  console.log({ list })
  const depth = propDepth || 0

  const sorting = useSorting(props, depth)
  const handlers = useHandlers(props, sorting)

  const newOptions: ReactSortableProps<T> = options
  return (
    <ReactSortable uncontrolled {...newOptions} {...handlers} list={list}>
      {list.map(item => {
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

function useHandlers<T extends Item>(
  props: SortableRecursiveProps<T>,
  sorting: UseSorting
): ActionHandlers {
  const { handleAddToState, handleRemoveFromState, handleUpdateTheState } = sorting

  const onAdd = (evt: SortableEvent, store: Store) => {
    handleAddToState(evt, store)
    if (props.onAdd) props.onAdd(evt, store)
  }

  const onRemove = (evt: SortableEvent, store: Store) => {
    handleRemoveFromState(evt)
    if (props.onRemove) props.onRemove(evt, store)
  }

  const onUpdate = (evt: SortableEvent, store: Store) => {
    handleUpdateTheState(evt, store)
    if (props.onUpdate) props.onUpdate(evt, store)
  }
  return { onAdd, onRemove, onUpdate }
}

interface UseSorting {
  handleAddToState: (evt: SortableEvent, store: Store) => void
  handleRemoveFromState: (evt: SortableEvent) => void
  handleUpdateTheState: (evt: SortableEvent, store: Store) => void
}

function useSorting<T extends Item>(props: SortableRecursiveProps<T>, depth: number) {
  const { setRootState } = props
  const constants = { depth, currentDepth: 0 }

  function handleAddToState(evt: SortableEvent, store: Store) {
    if (store.dragging === null) return console.error('bad vlaue in this')
    console.log('add')
    if (setRootState)
      setRootState(prevState => {
        const newItem: T = store.dragging!.props.list![evt.oldIndex!]
        const newState = addToState({
          ...constants,
          state: prevState,
          refItem: newItem,
          index: evt.newIndex!
        })
        console.log({ prevState, newState })

        return newState
      })
  }

  function handleRemoveFromState(evt: SortableEvent) {
    console.log('remove')
    setRootState(prevState => {
      const newState = removeFromState({
        ...constants,
        state: prevState,
        index: evt.oldIndex!
      })
      console.log({ prevState, newState })
      return newState
    })
  }

  function handleUpdateTheState(evt: SortableEvent, store: Store) {
    console.log('update')
    console.log({ setRootState })
    if (setRootState)
      setRootState(prevState => {
        const newItem: T = store.dragging!.props.list![evt.oldIndex!]

        const postRemove = removeFromState({
          ...constants,
          state: prevState,
          index: evt.oldIndex!
        })

        const postAdd = addToState({
          ...constants,
          refItem: newItem,
          state: postRemove,
          index: evt.newIndex!
        })
        console.log({ prevState, newState: postAdd })

        return postAdd
      })
  }
  return { handleAddToState, handleRemoveFromState, handleUpdateTheState }
}

export interface SortableRecursiveProps<T extends Item>
  extends Omit<ReactSortableProps<T>, 'setList'> {
  // nested sortable
  children: (item: T, Nested: FC) => ReactElement
  depth: number
  list: T[]

  setRootState: SetStateCallback<T[]>

  // react sortable
  // options
  group: string | GroupOptions
  swapThreshold: number
}

interface AddToStateParams<T extends Item> extends RemoveFromStateParams<T> {
  refItem: T
}

export function addToState<T extends Item>(params: AddToStateParams<T>): T[] {
  const { state, refItem, index, depth, currentDepth } = params
  const newState: T[] = []
  let currentIndex = 0
  if (!state) return newState
  for (const item of state) {
    const { children: placeholder, ...itemNoKids } = item
    const children = item.children
      ? addToState({ ...params, state: item.children, currentDepth: currentDepth + 1 })
      : []
    //@ts-ignore
    const newItem: T = children.length > 0 ? { ...itemNoKids, children } : { ...itemNoKids }
    if (currentDepth === depth && index === currentIndex) newState.push(refItem, newItem)
    else newState.push(newItem)
    currentIndex++
  }
  return newState
}

interface RemoveFromStateParams<T extends Item> {
  state: T[]
  index: number
  depth: number
  currentDepth: number
}

export function removeFromState<T extends Item>(params: RemoveFromStateParams<T>): T[] {
  const { state, index, depth, currentDepth } = params
  const newState: T[] = []
  let currentIndex = 0

  if (!state) return newState

  for (const item of [...state]) {
    const { children: placeholder, ...itemNoKids } = item
    const children = item.children
      ? removeFromState({ ...params, state: item.children, currentDepth: currentDepth + 1 })
      : []
    //@ts-ignore
    const newItem: T = children.length > 0 ? { ...itemNoKids, children } : { ...itemNoKids }
    const matches = currentDepth === depth && index === currentIndex
    if (!matches) newState.push(newItem)
    currentIndex++
  }
  return newState
}
