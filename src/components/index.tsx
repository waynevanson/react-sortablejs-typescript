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

import Sortable, { Options, SortableEvent, MoveEvent } from 'sortablejs'
import { removeNode, insertNodeAt } from '../util'

const store = { dragging: null as null | ReactSortable }

export class ReactSortable extends Component<ReactSortableProps> {
  private ref: RefObject<HTMLElement>

  get sortable() {
    return this.ref.current
  }

  constructor(props: ReactSortableProps) {
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
   * Calls the `props.onMove` function
   * @param moveEvt
   */
  triggerOnMove(moveEvt: MoveEvent) {
    const onMove = this.props.onMove
    if (onMove) onMove(moveEvt)
  }

  /**
   * Calls the `props.on[add, start, ...etc] function
   * @param evt
   * @param evtName
   */
  triggerOnElse(evt: SortableEvent, evtName: MethodsExcludingMove) {
    const propEvent = this.props[evtName]
    if (propEvent) propEvent(evt)
  }

  // Element is dropped into the list from another list
  onAdd(evt: SortableEvent) {
    // remove from this list,
    removeNode(evt.item)

    const { state, setState } = this.props
    // add item to the `props.state`
    const newState: Item[] = [...state]
    const newItem = store.dragging!.props.state![evt.oldIndex!]
    newState.splice(evt.newIndex!, 0, newItem)
    setState(newState)
  }

  // Element is removed from the list into another list
  onRemove(evt: SortableEvent) {
    // this had stuff in vue that is not handled here currently
    if (store.dragging === null || store.dragging.sortable === null) return
    const { item, oldIndex } = evt

    insertNodeAt(store.dragging.sortable, item, oldIndex!)

    const { state, setState } = this.props
    // add item to the `props.state`
    const newState: Item[] = [...state]
    const [oldItem] = newState.splice(evt.oldIndex!, 1)
    setState(newState)
  }

  // Changed sorting within list
  // basically the add and remove for actions in the same list
  onUpdate(evt: SortableEvent) {
    removeNode(evt.item)
    insertNodeAt(evt.from, evt.item, evt.oldIndex!)

    const { state, setState } = this.props
    // add item to the `props.state`
    const newState: Item[] = [...state]
    const [oldItem] = newState.splice(evt.oldIndex!, 1)
    newState.splice(evt.newIndex!, 0, oldItem)
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
    const { state, setState, children, tag, style, className, ...options } = this.props
    const removers: MethodsDOM[] = ['onAdd', 'onUpdate', 'onRemove', 'onStart', 'onEnd']
    const norms: Exclude<MethodsExcludingMove, MethodsDOM>[] = [
      'onUnchoose',
      'onChoose',
      'onClone',
      'onFilter',
      'onSort'
    ]
    const newOptions: Options = options
    removers.forEach(name => (newOptions[name] = this.callbacksWithOnEvent(name)))
    norms.forEach(name => (newOptions[name] = this.callbacks(name)))
    return newOptions
  }

  /**
   * Returns a function that
   * triggers one of the internal methods
   * when a sortable method is triggered
   *
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

export interface ReactSortableProps extends Options {
  state: Item[] | undefined
  setState: (newItems: Item[]) => void
  /**
   * If parsing in a component WITHOUT a ref, an error will be thrown.
   * 
   * To fix this, use the `forwardRef` component.
   * 
   * @example
   * forwardRef<HTMLElement, YOURPROPS>((props, ref) => <button ref={ref} />)
   */
  tag?: ForwardRefExoticComponent<RefAttributes<HTMLElement>> | keyof ReactHTML
  plugins?: any[]
  style?: CSSProperties
  className?: string
}

export interface Item {
  id: string
  children?: Item[]
  [key: string]: any
}

export type OptionsExcludingGroup = Omit<Options, 'group'>

export type MethodsExcludingMove = Exclude<Methods, 'onMove'>
/** Method names that change the DOM */
export type MethodsDOM = 'onAdd' | 'onRemove' | 'onUpdate' | 'onStart' | 'onEnd'

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
