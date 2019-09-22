import {
  Component,
  createRef,
  RefObject,
  createElement,
  RefAttributes,
  ForwardRefExoticComponent,
  CSSProperties
} from 'react'

import Sortable, { Options, GroupOptions, SortableEvent, MoveEvent } from 'sortablejs'

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
    const { options, groupOptions } = this.props
    const newOptions = this.makeOptions(options, groupOptions)
    Sortable.create(this.ref.current, newOptions)
  }

  render() {
    const { tag, children, style, className } = this.props
    const ss = { style, className }
    const tagCheck = !tag || tag === null ? 'div' : tag
    return createElement(tagCheck, { ref: this.ref, ...ss }, children)
  }

  triggerOnMove(moveEvt: MoveEvent) {
    const onMove = this.props.onMove
    if (onMove) onMove(moveEvt)
  }

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

  makeOptions(options: OptionsExcludingGroup = {}, groupOptions?: GroupOptions): Options {
    const group = groupOptions && { group: groupOptions }
    const removers: MethodsDOM[] = ['onAdd', 'onUpdate', 'onRemove', 'onStart', 'onEnd']
    const norms: Exclude<MethodsExcludingMove, MethodsDOM>[] = [
      'onUnchoose',
      'onChoose',
      'onClone',
      'onFilter',
      'onSort'
    ]

    const newOptions: OptionsWithMethodsOnly = {}
    removers.forEach(name => (newOptions[name] = this.deliverCallbacks(name)))
    norms.forEach(name => (newOptions[name] = this.justEmit(name)))
    return { ...options, ...newOptions, ...group }
  }

  /**
   * Returns a function that triggers **a DOM change** when a sortable method is triggered
   */
  deliverCallbacks(evtName: MethodsDOM) {
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
  justEmit(evtName: Exclude<MethodsExcludingMove, MethodsDOM>) {
    return (evt: SortableEvent) => {
      // call the component prop
      this.triggerOnElse(evt, evtName)
    }
  }
}

//
//  UTIL
//

// append the functions that change the dom

/**
 * Removes the `node` from the DOM
 * @param node
 */
function removeNode(node: HTMLElement) {
  if (node.parentElement !== null) node.parentElement.removeChild(node)
}

/**
 * Uses
 * @param containerNode
 * @param nodeToInsert
 * @param atPosition a number that is not negative
 */
function insertNodeAt(containerNode: HTMLElement, nodeToInsert: HTMLElement, atPosition: number) {
  const refNode =
    atPosition === 0
      ? containerNode.children[0]
      : containerNode.children[atPosition - 1].nextSibling
  containerNode.insertBefore(nodeToInsert, refNode)
}

//
// TYPES
//

export interface ReactSortableProps extends OptionsWithMethodsOnly {
  state: Item[] | undefined
  setState: (newItems: Item[]) => void
  /**
   * This excludes `options.group`.
   * Instead, use the `group` prop for this component.
   */
  options?: OptionsExcludingGroup
  groupOptions?: GroupOptions
  tag?: ForwardRefExoticComponent<RefAttributes<HTMLElement>>
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

export type OptionsWithMethodsOnly = Pick<Options, Methods>
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

export type MethodsExcludingMove = Exclude<Methods, 'onMove'>
/** Method names that change the DOM */
export type MethodsDOM = 'onAdd' | 'onRemove' | 'onUpdate' | 'onStart' | 'onEnd'
