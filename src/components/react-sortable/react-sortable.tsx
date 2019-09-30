import {
  Component,
  createRef,
  RefObject,
  createElement,
  RefAttributes,
  ForwardRefExoticComponent,
  CSSProperties,
  ReactHTML,
  Dispatch
} from 'react'

import Sortable, { Options, SortableEvent } from 'sortablejs'

import { removeNode, insertNodeAt, destructurePropsForOptions } from './util'

const store: Store = { dragging: null }

/**
 * A component for making the first layer of children sortable,
 * using `SortableJS` to manipulate the DOM.
 */
export class ReactSortable<T> extends Component<ReactSortableProps<T>> {
  private ref: RefObject<HTMLElement>
  childState: T[] | null = null
  constructor(props: ReactSortableProps<T>) {
    super(props)
    this.ref = createRef<HTMLElement>()
  }

  componentDidMount() {
    if (this.ref.current === null) return
    const newOptions = this.makeOptions()
    Sortable.create(this.ref.current, newOptions)
  }

  render() {
    const { tag, children, style, className } = this.props
    const classicProps = { style, className }
    const tagCheck = !tag || tag === null ? 'div' : tag
    // todo: add data-id to children
    return createElement(tagCheck, { ref: this.ref, ...classicProps }, children)
  }

  /**
   * Calls the `props.on[add | start | ...etc]` function
   * @param evt
   * @param evtName
   */
  triggerOnElse(evt: SortableEvent, evtName: SortableMethodKeysWithoutMove) {
    const propEvent = this.props[evtName]
    if (propEvent) propEvent(evt, store)
  }

  // Element is dropped into the list from another list
  onAdd(evt: SortableEvent) {
    const { setList, uncontrolled } = this.props
    // remove from this list,
    removeNode(evt.item)
    if (uncontrolled || !setList) return
    // add item to the `props.state`
    setList(prevState => {
      const newState: T[] = [...prevState]
      const newItem = store.dragging!.props.list![evt.oldIndex!]
      newState.splice(evt.newIndex!, 0, newItem)
      return newState
    })
  }

  // Element is removed from the list into another list
  onRemove(evt: SortableEvent) {
    const { item, from, oldIndex } = evt
    insertNodeAt(from, item, oldIndex!)
    const { setList, uncontrolled } = this.props
    if (uncontrolled || !setList) return

    // remove item in the `props.state`fromComponent
    setList(prevState => {
      const newState: T[] = [...prevState]
      newState.splice(oldIndex!, 1)
      return newState
    })
  }

  // Changed sorting within list
  // basically the add and remove for actions in the same list
  onUpdate(evt: SortableEvent) {
    removeNode(evt.item)
    insertNodeAt(evt.from, evt.item, evt.oldIndex!)

    const { setList, uncontrolled } = this.props
    if (uncontrolled || !setList) return

    // remove and add items to the `props.state`
    setList(prevList => {
      const newState: T[] = [...prevList]
      const [oldItem] = newState.splice(evt.oldIndex!, 1)
      newState.splice(evt.newIndex!, 0, oldItem)
      return newState
    })
  }

  onStart(evt: SortableEvent) {
    store.dragging = this
  }

  onEnd(evt: SortableEvent) {
    store.dragging = null
  }

  /**
   * Append the props that are options into the options
   */
  makeOptions(): Options {
    const removers: SortableMethodKeysReactHandling[] = [
      'onAdd',
      'onUpdate',
      'onRemove',
      'onStart',
      'onEnd'
    ]
    const norms: Exclude<SortableMethodKeysWithoutMove, SortableMethodKeysReactHandling>[] = [
      'onUnchoose',
      'onChoose',
      'onClone',
      'onFilter',
      'onSort',
      'onChange'
    ]
    const options = destructurePropsForOptions(this.props)
    const newOptions: Options = options
    removers.forEach(name => (newOptions[name] = this.callbacksWithOnEvent(name)))
    norms.forEach(name => (newOptions[name] = this.callbacks(name)))
    // todo: add `onMove`. Types are cooked on this one not sure why...
    return {
      ...newOptions
    }
  }

  /**
   * Returns a function that
   * triggers one of the internal methods
   * when a sortable method is triggered
   */
  callbacksWithOnEvent(evtName: SortableMethodKeysReactHandling) {
    return (evt: SortableEvent) => {
      // calls state change
      this[evtName](evt)
      // call the component prop
      this.triggerOnElse(evt, evtName)
    }
  }

  /**
   * Returns a function that triggers when a sortable method is triggered
   */
  callbacks(evtName: Exclude<SortableMethodKeysWithoutMove, SortableMethodKeysReactHandling>) {
    return (evt: SortableEvent) => {
      // call the component prop
      this.triggerOnElse(evt, evtName)
    }
  }
}

//
// TYPES
//

export interface ReactSortableProps<T> extends NewOptions {
  /**
   * Does not induce any state changes when DOM is updated
   */
  uncontrolled?: boolean
  list?: T[]
  setList?: SetStateCallback<T[]>
  /**
   * If parsing in a component WITHOUT a ref, an error will be thrown.
   *
   * To fix this, use the `forwardRef` component.
   *
   * @example
   * forwardRef<HTMLElement, YOURPROPS>((props, ref) => <button ref={ref} />)
   */
  tag?: ForwardRefExoticComponent<RefAttributes<any>> | keyof ReactHTML
  style?: CSSProperties
  className?: string
}

export interface Store {
  dragging: null | ReactSortable<any>
}

export type SetStateCallback<S> = Dispatch<(prevState: S) => S>

//
// TYPES FOR METHODS
//
export type SortableMethodKeys =
  | 'onAdd'
  | 'onChoose'
  | 'onClone'
  | 'onEnd'
  | 'onFilter'
  | 'onMove'
  | 'onRemove'
  | 'onSort'
  | 'onStart'
  | 'onUnchoose'
  | 'onUpdate'
  | 'onChange'

/** Method names that fire in `this`, when this is react-sortable */
type SortableMethodKeysReactHandling = 'onAdd' | 'onRemove' | 'onUpdate' | 'onStart' | 'onEnd'

type SortableMethodKeysWithoutMove = Exclude<SortableMethodKeys, 'onMove'>

interface NewSortableMethodMove {
  onMove?: (evt: SortableEvent, originalEvent: Event, store: Store) => boolean | -1 | 0 | 1 // return false; — for cancel
}

// remove old methds, add new
// remove methods
// ad all but move as partial
// add ove as partial
type NewOptions = Omit<Options, SortableMethodKeys> &
  NewSortableMethodsWithoutMove &
  NewSortableMethodMove

type NewSortableMethodsWithoutMove = Partial<
  Record<SortableMethodKeysWithoutMove, (evt: SortableEvent, store: Store) => void>
>
// type NewMoveOptions
