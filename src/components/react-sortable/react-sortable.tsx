import {
  Component,
  createElement,
  createRef,
  CSSProperties,
  ForwardRefExoticComponent,
  ReactHTML,
  RefAttributes,
  RefObject,
  Dispatch
} from 'react'
import Sortable, { Options, SortableEvent, MoveEvent } from 'sortablejs'
import {
  destructurePropsForOptions,
  insertNodeAt,
  removeNode,
  addDataIDAttributeToChildren
} from './util'

// add option to store this in context, instead of here.
const store: Store = { dragging: null }

/**
 * A component for making the first layer of children sortable,
 * using `SortableJS` to manipulate the DOM.
 */
// todo: clone function from props
export class ReactSortable<T> extends Component<ReactSortableProps<T>> {
  private ref: RefObject<HTMLElement>

  constructor(props: ReactSortableProps<T>) {
    super(props)
    this.ref = createRef<HTMLElement>()
  }

  /**
   * Appends the `sortable` property to this component.
   *
   * Sortable initializes it's instance using `Sortable + new Date()`,
   * which is why we have this funky logic
   */
  private get sortable(): Sortable | null {
    const el = this.ref.current
    if (el === null) return null
    const key = Object.keys(el).find(k => k.includes('Sortable'))
    if (!key) return null
    //@ts-ignore
    return el[key]
  }

  componentDidMount() {
    if (this.ref.current === null) return
    const newOptions = this.makeOptions()
    Sortable.create(this.ref.current, newOptions)
    // mount plugins if parsed
    const { plugins } = this.props
    if (!plugins) return
    if (plugins instanceof Array) Sortable.mount(...plugins)
    else Sortable.mount(plugins)
  }

  render() {
    const { tag, children, style, className, dataIdAttr } = this.props
    const classicProps = { style, className }
    const tagCheck = !tag || tag === null ? 'div' : tag
    const childrenWithDataID = addDataIDAttributeToChildren(children, dataIdAttr)
    return createElement(tagCheck, { ref: this.ref, ...classicProps }, childrenWithDataID)
  }

  /**
   * Calls the `props.on[add | start | ...etc]` function
   * @param evt
   * @param evtName
   */
  triggerOnElse(evt: SortableEvent, evtName: SortableMethodKeysWithoutMove) {
    const propEvent = this.props[evtName]
    if (propEvent) propEvent(evt, this.sortable, store)
  }

  // Element is dropped into the list from another list
  onAdd(evt: SortableEvent) {
    const { list, setList } = this.props
    // remove from this list,
    removeNode(evt.item)
    // add item to the `props.state`
    const newState: T[] = [...list]
    const newItem = store.dragging!.props.list[evt.oldIndex!]
    newState.splice(evt.newIndex!, 0, newItem)
    setList(newState, this.sortable, store)
  }

  /** Element is removed from the list into another list */
  onRemove(evt: SortableEvent) {
    const { item, from, oldIndex } = evt
    insertNodeAt(from, item, oldIndex!)
    const { list, setList } = this.props

    // remove item in the `props.state`fromComponent
    const newState: T[] = [...list]
    newState.splice(oldIndex!, 1)
    setList(newState, this.sortable, store)
  }

  // Changed sorting within list
  // basically the add and remove for actions in the same list
  onUpdate(evt: SortableEvent) {
    removeNode(evt.item)
    insertNodeAt(evt.from, evt.item, evt.oldIndex!)

    const { list, setList } = this.props

    // remove and add items to the `props.state`
    const newState: T[] = [...list]
    const [oldItem] = newState.splice(evt.oldIndex!, 1)
    newState.splice(evt.newIndex!, 0, oldItem)
    setList(newState, this.sortable, store)
  }

  onStart(evt: SortableEvent) {
    store.dragging = this
  }

  onEnd(evt: SortableEvent) {
    store.dragging = null
  }

  onSpill(evt: SortableEvent) {
    const { removeOnSpill, revertOnSpill } = this.props
    if (removeOnSpill && !revertOnSpill) removeNode(evt.item)
  }

  onClone(evt: SortableEvent) {}

  /**
   * Append the props that are options into the options
   */
  makeOptions(): Options {
    const removers: SortableMethodKeysReact[] = [
      'onAdd',
      'onUpdate',
      'onRemove',
      'onStart',
      'onEnd',
      'onSpill'
    ]
    const norms: Exclude<SortableMethodKeysWithoutMove, SortableMethodKeysReact>[] = [
      'onUnchoose',
      'onChoose',
      'onClone',
      'onFilter',
      'onSort',
      'onChange'
    ]
    const newOptions: Options = destructurePropsForOptions(this.props)
    removers.forEach(name => (newOptions[name] = this.callbacksWithOnEvent(name)))
    norms.forEach(name => (newOptions[name] = this.callbacks(name)))
    return {
      ...newOptions,
      // We are altering the behavoiur here.
      onMove: (evt, originalEvt) => {
        const { onMove } = this.props
        const defaultValue = evt.willInsertAfter || -1
        if (!onMove) return defaultValue
        return onMove(evt, originalEvt, this.sortable, store) || defaultValue
      }
    }
  }

  /**
   * Returns a function that
   * triggers one of the `ReactSortable` internal methods
   * when a sortable method is triggered
   */
  callbacksWithOnEvent(evtName: SortableMethodKeysReact) {
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
  callbacks(evtName: Exclude<SortableMethodKeysWithoutMove, SortableMethodKeysReact>) {
    return (evt: SortableEvent) => {
      // call the component prop
      this.triggerOnElse(evt, evtName)
    }
  }
}

//
// TYPES
//
export interface ReactSortableProps<T> extends ReactSortableOptions {
  /**
   * The list of items to use.
   */
  list: T[]
  /**
   * Sets the state for your list of items.
   */
  setList: (newState: T[], sortable: Sortable | null, store: Store) => void
  /**
   * If parsing in a component WITHOUT a ref, an error will be thrown.
   *
   * To fix this, use the `forwardRef` component.
   *
   * @example
   * forwardRef<HTMLElement, YOURPROPS>((props, ref) => <button {...props} ref={ref} />)
   */
  tag?: ForwardRefExoticComponent<RefAttributes<any>> | keyof ReactHTML
  style?: CSSProperties
  className?: string
  /**
   * Parse the plugins you'd like to use in Sortable.
   */
  plugins?: Sortable.Plugin | Array<Sortable.Plugin>
}

/**
 * Used as
 */
export interface Store {
  dragging: null | ReactSortable<any>
}

//
// TYPES FOR METHODS
//

// OPTIONS

/**
 * Change the `on[...]` methods in Sortable.Options,
 * so that they all have an extra arg that is `store: Store`
 */
type ReactSortableOptions = Omit<Options, SortableMethodKeys> &
  Partial<
    Record<
      SortableMethodKeysWithoutMove,
      (evt: SortableEvent, sortable: Sortable | null, store: Store) => void
    >
  > & {
    /**
     * The default sortable behaviour has been changed.
     * 
     * If the return value is void, then the defaults will kick in.
     * it saves the user trying to figure it out.
     * and they can just use onmove as a callback value
     */
    onMove?: (
      evt: MoveEvent,
      originalEvent: Event,
      sortable: Sortable | null,
      store: Store
    ) => boolean | -1 | 1 | void
  }

// STRINGS

/** All method names starting with `on` in `Sortable.Options` */
export type SortableMethodKeys =
  | 'onAdd'
  | 'onChange'
  | 'onChoose'
  | 'onClone'
  | 'onEnd'
  | 'onFilter'
  | 'onMove'
  | 'onRemove'
  | 'onSort'
  | 'onSpill'
  | 'onStart'
  | 'onUnchoose'
  | 'onUpdate'

/** Method names that fire in `this`, when this is react-sortable */
type SortableMethodKeysReact = 'onAdd' | 'onRemove' | 'onUpdate' | 'onStart' | 'onEnd' | 'onSpill'

/**
 * Same as `SortableMethodKeys` type but with out the string `onMove`.
 */
type SortableMethodKeysWithoutMove = Exclude<SortableMethodKeys, 'onMove'>
