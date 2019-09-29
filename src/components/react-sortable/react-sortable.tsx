import {
  Component,
  createRef,
  RefObject,
  createElement,
  RefAttributes,
  ForwardRefExoticComponent,
  CSSProperties,
  ReactHTML
} from 'react'

import Sortable, { Options, SortableEvent } from 'sortablejs'

import { removeNode, insertNodeAt, destructurePropsForOptions } from '../../util'

export interface Store {
  dragging: null | ReactSortable<any>
}
const store: Store = { dragging: null }

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
    return createElement(tagCheck, { ref: this.ref, ...classicProps }, children)
  }

  /**
   * Calls the `props.on[add | start | ...etc]` function
   * @param evt
   * @param evtName
   */
  triggerOnElse(evt: SortableEvent, evtName: MethodsExcludingMove) {
    const propEvent = this.props[evtName]
    if (propEvent) propEvent(evt, store)
  }

  // Element is dropped into the list from another list
  onAdd(evt: SortableEvent) {
    const { list: state, setList: setState, uncontrolled } = this.props
    // remove from this list,
    removeNode(evt.item)
    if (uncontrolled || !setState) return
    // add item to the `props.state`
    const newState: T[] = [...state]

    const newItem = store.dragging!.props.list![evt.oldIndex!]
    newState.splice(evt.newIndex!, 0, newItem)
    setState(newState)
  }

  // Element is removed from the list into another list
  onRemove(evt: SortableEvent) {
    const { item, from, oldIndex } = evt
    insertNodeAt(from, item, oldIndex!)
    const { list: state, setList: setState, uncontrolled } = this.props
    if (uncontrolled || !setState) return

    // remove item in the `props.state`fromComponent

    const newState: T[] = [...state]
    setState(newState)
  }

  // Changed sorting within list
  // basically the add and remove for actions in the same list
  onUpdate(evt: SortableEvent) {
    removeNode(evt.item)
    insertNodeAt(evt.from, evt.item, evt.oldIndex!)

    const { list: state, setList: setState, uncontrolled } = this.props
    if (uncontrolled || !setState) return

    // add item to the `props.state`
    const newState: T[] = [...state]
    const [oldItem] = newState.splice(evt.oldIndex!, 1)
    newState.splice(evt.newIndex!, 0, oldItem)
    // works because it's only one state change
    setState(newState)
  }

  onStart(evt: SortableEvent) {
    store.dragging = this
  }
  onEnd(evt: SortableEvent) {
    store.dragging = null
  }

  /**
   * Append the props that are options into the options
   * @param options
   * @param groupOptions
   */
  makeOptions(): Options {
    const options = destructurePropsForOptions(this.props)
    const removers: MethodsDOM[] = ['onAdd', 'onUpdate', 'onRemove', 'onStart', 'onEnd']
    const norms: Exclude<MethodsExcludingMove, MethodsDOM>[] = [
      'onUnchoose',
      'onChoose',
      'onClone',
      'onFilter',
      'onSort',
      'onChange'
    ]
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
  callbacksWithOnEvent(evtName: MethodsDOM) {
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
  callbacks(evtName: Exclude<MethodsExcludingMove, MethodsDOM>) {
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
  setList?: (newItems: T[]) => void
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

/**
 * This is the recommended list item type.
 * implement or extend this when creating your own.
 */
export interface Item {
  id: string
  children?: Item[]
  [key: string]: any
}

//
// TYPES FOR METHODS
//

/** Method names that fire in this, when this is react-sortable */
export type MethodsDOM = 'onAdd' | 'onRemove' | 'onUpdate' | 'onStart' | 'onEnd'

export type MethodsExcludingMove = Exclude<Methods, 'onMove'>

export type Methods =
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

export interface NewMethodMove {
  onMove: (evt: SortableEvent, originalEvent: Event, store: Store) => boolean | -1 | 0 | 1 // return false; — for cancel
}

// remove old methds, add new
// remove methods
// ad all but move as partial
// add ove as partial
export type NewOptions = Omit<Options, Methods> & ss & Partial<NewMethodMove>
type ss = Partial<Record<MethodsExcludingMove, (evt: SortableEvent, store: Store) => void>>
