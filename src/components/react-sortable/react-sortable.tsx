import {
  Component,
  createRef,
  RefObject,
  createElement,
  RefAttributes,
  ForwardRefExoticComponent,
  CSSProperties,
  ReactHTML,
  Dispatch,
  SetStateAction
} from 'react'

import Sortable, { Options, SortableEvent } from 'sortablejs'

import { removeNode, insertNodeAt, destructurePropsForOptions } from './util'

// add option to store this in context, instead of here.
const store: Store = { dragging: null }

/**
 * A component for making the first layer of children sortable,
 * using `SortableJS` to manipulate the DOM.
 */
export class ReactSortable<T> extends Component<ReactSortableProps<T>> {
  private ref: RefObject<HTMLElement>
  childState: T[] | null = null
  state = { isClone: false }
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
  // create onSpill
  triggerOnElse(evt: SortableEvent, evtName: SortableMethodKeysWithoutMove) {
    const propEvent = this.props[evtName]
    if (propEvent) propEvent(evt, store)
  }

  // Element is dropped into the list from another list
  onAdd(evt: SortableEvent) {
    const { list, setList, uncontrolled } = this.props
    // remove from this list,
    removeNode(evt.item)
    if (uncontrolled || !setList) return
    // add item to the `props.state`
    const newState: T[] = [...list]
    const newItem = store.dragging!.props.list[evt.oldIndex!]
    newState.splice(evt.newIndex!, 0, newItem)
    setList(newState)
  }

  // Element is removed from the list into another list
  onRemove(evt: SortableEvent) {
    const { item, from, oldIndex } = evt
    insertNodeAt(from, item, oldIndex!)
    const { list, setList, uncontrolled } = this.props
    if (uncontrolled || !setList) return

    // remove item in the `props.state`fromComponent
    const newState: T[] = [...list]
    newState.splice(oldIndex!, 1)
    setList(newState)
  }

  // Changed sorting within list
  // basically the add and remove for actions in the same list
  onUpdate(evt: SortableEvent) {
    removeNode(evt.item)
    insertNodeAt(evt.from, evt.item, evt.oldIndex!)

    const { list, setList, uncontrolled } = this.props
    if (uncontrolled || !setList) return

    // remove and add items to the `props.state`
    const newState: T[] = [...list]
    const [oldItem] = newState.splice(evt.oldIndex!, 1)
    newState.splice(evt.newIndex!, 0, oldItem)
    setList(newState)
  }

  onStart(evt: SortableEvent) {
    store.dragging = this
  }

  onEnd(evt: SortableEvent) {
    store.dragging = null
  }

  onSpill(evt: SortableEvent) {
    removeNode(evt.item)
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
    // todo: add `onSpill` methods and DOM changes
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
      // call the component prop
      this.triggerOnElse(evt, evtName)
      // calls state change
      this[evtName](evt)
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
  list: T[]
  setList?: Dispatch<SetStateAction<T[]>>
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

type NewOptions = Omit<Options, SortableMethodKeys> &
  NewSortableMethodsWithoutMove &
  NewSortableMethodMove

type NewSortableMethodsWithoutMove = Partial<
  Record<SortableMethodKeysWithoutMove, (evt: SortableEvent, store: Store) => void>
>
// type NewMoveOptions
//  todo: add on spill
