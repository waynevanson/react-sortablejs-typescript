import React, { FC, ReactElement, cloneElement, useContext, useEffect } from 'react'
import { ReactSortable, Item, ReactSortableProps, Store } from './react-sortable'
import { GroupOptions, SortableEvent } from 'sortablejs'
import { sortableContext, offState } from './hoc-nested'

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
// neeed to keep track on the PATH of the item, like old times
export function ReactSortableNested<T extends Item>(props: ReactSortableNestedProps<T>) {
  const { children, list, depth: propDepth, ...options } = props
  const depth = propDepth || 0

  const sorting = useSorting(depth)
  const handlers = useHandlers(props, sorting)
  if (!list) return null
  return (
    //@ts-ignore
    <ReactSortable uncontrolled {...options} {...handlers} list={list}>
      {list.map(item => {
        const Nested: FC = () => (
          <ReactSortableNested
            {...options}
            //@ts-ignore
            children={children}
            depth={depth + 1}
            //@ts-ignore
            list={item.children || ([] as T[])}
          />
        )
        const rendered = children(item, Nested)
        // needed to add a key to the element
        // what about a ref?
        return cloneElement(rendered, { key: item.id })
      })}
    </ReactSortable>
  )
}

function useHandlers<T extends Item>(
  props: ReactSortableNestedProps<T>,
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

function useSorting<T extends Item>(depth: number) {
  const { rootState,setRootState } = useContext(sortableContext)
  const constants = { state: rootState, depth, currentDepth: 0 }

  function handleAddToState(evt: SortableEvent, store: Store) {
    if (store.dragging == null) return console.error('bad vlaue in this')

    const newItem: T = store.dragging.props.list![evt.oldIndex!]
    const newState = addToState({
      ...constants,
      refItem: newItem,
      index: evt.newIndex!
    })
    console.log('add', { old: rootState, new: newState })
    offState.current = newState
    if (setRootState) setRootState(newState)
  }

  function handleRemoveFromState(evt: SortableEvent) {
    const newState = removeFromState({
      ...constants,
      index: evt.oldIndex!
    })
    console.log('remove', { old: rootState, new: newState })
    offState.current = newState
    if (setRootState) setRootState(newState)
  }

  function handleUpdateTheState(evt: SortableEvent, store: Store) {
    if (store.dragging === null)
      return console.error('store return null when updating state in HANDLEUPDATETHESTATE()')

    const newItem: T = store.dragging.props.list![evt.oldIndex!]

    const postRemove = removeFromState({
      ...constants,
      index: evt.oldIndex!
    })

    const postAdd = addToState({
      ...constants,
      refItem: newItem,
      state: postRemove,
      index: evt.newIndex!
    })

    console.log('update', { old: rootState, new: postAdd })
    offState.current = postAdd

    if (setRootState) setRootState(postAdd)
  }
  return { handleAddToState, handleRemoveFromState, handleUpdateTheState }
}

export interface ReactSortableNestedProps<T extends Item>
  extends Omit<ReactSortableProps<T>, 'setList'> {
  // nested sortable
  children: (item: T, Nested: FC) => ReactElement
  depth: number
  list: T[]

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
