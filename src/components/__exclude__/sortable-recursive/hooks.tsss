import { Item, Store } from '..'

import { SortableRecursiveProps } from '.'

import { SortableEvent } from 'sortablejs'

export function useHandlers<T extends Item>(
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

export function useSorting<T extends Item>(props: SortableRecursiveProps<T>, depth: number) {
  const { setRootState } = props
  const constants = { depth, currentDepth: 0 }

  function handleAddToState(evt: SortableEvent, store: Store) {
    setRootState(prevState => {
      const newItem: T = store.dragging!.props.list![evt.oldIndex!]
      const newState = addToState({
        ...constants,
        state: prevState,
        refItem: newItem,
        index: evt.newIndex!
      })
      return newState
    })
  }

  function handleRemoveFromState(evt: SortableEvent) {
    setRootState(prevState => {
      const newState = removeFromState({
        ...constants,
        state: prevState,
        index: evt.oldIndex!
      })
      return newState
    })
  }

  function handleUpdateTheState(evt: SortableEvent, store: Store) {
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
      return postAdd
    })
  }
  return { handleAddToState, handleRemoveFromState, handleUpdateTheState }
}

// use paths so we know where to go.
// i almost want to make a travserse function
// that walks through the tree

export function addToState<T extends Item>(params: AddToStateParams<T>): T[] {
  const { state, refItem, index, depth, currentDepth } = params
  const newState: T[] = []
  let currentIndex = 0
  for (const item of state) {
    const { children: placeholder, ...itemNoKids } = item
    const children = addToState({
      ...params,
      state: item.children,
      currentDepth: currentDepth + 1
    })
    //@ts-ignore
    const newItem: T = { ...itemNoKids, children }
    if (currentDepth === depth && index === currentIndex) newState.push(refItem, newItem)
    else newState.push(newItem)
    currentIndex++
  }
  return newState
}

export function removeFromState<T extends Item>(params: RemoveFromStateParams<T>): T[] {
  const { state, index, depth, currentDepth } = params
  const newState: T[] = []
  let currentIndex = 0

  for (const item of state) {
    const { children: placeholder, ...itemNoKids } = item
    const children = removeFromState({
      ...params,
      state: item.children,
      currentDepth: currentDepth + 1
    })
    //@ts-ignore
    const newItem: T = { ...itemNoKids, children }
    const matches = currentDepth === depth && index === currentIndex
    if (!matches) newState.push(newItem)
    currentIndex++
  }
  return newState
}

type ActionHandlers = Record<
  'onAdd' | 'onRemove' | 'onUpdate',
  (evt: SortableEvent, store: Store) => void
>

interface RemoveFromStateParams<T extends Item> {
  state: T[]
  index: number
  depth: number
  currentDepth: number
}

interface AddToStateParams<T extends Item> extends RemoveFromStateParams<T> {
  refItem: T
}
