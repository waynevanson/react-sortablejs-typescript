import { Component, createElement, createRef, ReactNode, RefObject } from 'react'
import Sortable, { Options, SortableEvent } from 'sortablejs'
import {
  AllMethodsExceptMove,
  HandledMethodNames,
  ReactSortableProps,
  Store,
  UnHandledMethodNames
} from './types'
import { destructurePropsForOptions, insertNodeAt, modifyChildren, removeNode } from './util'
import { throwStatement } from '@babel/types'

/** Holds a global reference for which react element is being dragged */
const store: Store = { dragging: null }

/**
 * A component for making the first layer of children sortable,
 * using `SortableJS` to manipulate the DOM.
 */
export class ReactSortable<T> extends Component<ReactSortableProps<T>> {
  private ref: RefObject<HTMLElement>

  constructor(props: ReactSortableProps<T>) {
    super(props)
    this.ref = createRef<HTMLElement>()
  }

  componentDidMount() {
    if (this.ref.current === null) return
    const newOptions = this.makeOptions()
    Sortable.create(this.ref.current, newOptions)
    // mount plugins if any
    const { plugins } = this.props
    if (!plugins) return
    if (plugins instanceof Array) Sortable.mount(...plugins)
    else Sortable.mount(plugins)
  }

  render() {
    const { tag, style, className } = this.props
    const classicProps = { style, className }
    const tagCheck = !tag || tag === null ? 'div' : tag
    const newChildren: ReactNode = modifyChildren(this.props)
    return createElement(tagCheck, { ref: this.ref, ...classicProps }, newChildren)
  }

  /** Appends the `sortable` property to this component */
  private get sortable(): Sortable | null {
    const el = this.ref.current
    if (el === null) return null
    const key = Object.keys(el).find(k => k.includes('Sortable'))
    if (!key) return null
    //@ts-ignore - I know what I'm doing.
    return el[key]
  }

  /** Converts all the props from `ReactSortable` into an object that `Sortable.create(el, [options])` can use */
  makeOptions(): Options {
    const DOMHandlers: HandledMethodNames[] = [
      'onAdd',
      'onUpdate',
      'onRemove',
      'onStart',
      'onEnd',
      'onSpill',
      'onClone'
    ]
    const NonDOMHandlers: UnHandledMethodNames[] = [
      'onUnchoose',
      'onChoose',
      'onFilter',
      'onSort',
      'onChange'
    ]
    const newOptions: Options = destructurePropsForOptions(this.props)
    DOMHandlers.forEach(name => (newOptions[name] = this.prepareOnHandlerPropAndDOM(name)))
    NonDOMHandlers.forEach(name => (newOptions[name] = this.prepareOnHandlerProp(name)))
    return {
      ...newOptions,
      onMove: (evt, originalEvt) => {
        const { onMove } = this.props
        const defaultValue = evt.willInsertAfter || -1
        if (!onMove) return defaultValue
        return onMove(evt, originalEvt, this.sortable, store) || defaultValue
      }
    }
  }

  /** Prepares a method that will be used in the sortable options to call an `on[Handler]` prop & an `on[Handler]` ReactSortable method  */
  prepareOnHandlerPropAndDOM(evtName: HandledMethodNames) {
    return (evt: SortableEvent) => {
      // call the component prop
      this.callOnHandlerProp(evt, evtName)
      // calls state change
      this[evtName](evt)
    }
  }

  /** Prepares a method that will be used in the sortable options to call an `on[Handler]` prop */
  prepareOnHandlerProp(evtName: Exclude<AllMethodsExceptMove, HandledMethodNames>) {
    return (evt: SortableEvent) => {
      // call the component prop
      this.callOnHandlerProp(evt, evtName)
    }
  }

  /** Calls the `props.on[Handler]` function */
  callOnHandlerProp(evt: SortableEvent, evtName: AllMethodsExceptMove) {
    const propEvent = this.props[evtName]
    if (propEvent) propEvent(evt, this.sortable, store)
  }

  /** Called when an element is dropped into the list from another list */
  onAdd(evt: SortableEvent) {
    const { list, setList } = this.props
    removeNode(evt.item)
    const newState: T[] = [...list]
    const newItem = store.dragging!.props.list[evt.oldIndex!]
    newState.splice(evt.newIndex!, 0, newItem)
    setList(newState, this.sortable, store)
  }

  /** Called when an element is removed from the list into another list */
  onRemove(evt: SortableEvent) {
    const { item, from, oldIndex, clone, pullMode } = evt
    insertNodeAt(from, item, oldIndex!)
    if (pullMode === 'clone') return removeNode(clone)
    const { list, setList } = this.props
    const newState: T[] = [...list]
    newState.splice(oldIndex!, 1)
    setList(newState, this.sortable, store)
  }

  /** Called when sorting is changed within the same list */
  onUpdate(evt: SortableEvent) {
    const { item, from, oldIndex, newIndex } = evt
    removeNode(item)
    insertNodeAt(from, item, oldIndex!)

    const { list, setList } = this.props
    const newState: T[] = [...list]
    const [oldItem] = newState.splice(oldIndex!, 1)
    newState.splice(newIndex!, 0, oldItem)
    setList(newState, this.sortable, store)
  }

  /** Called when the dragging starts */
  onStart(evt: SortableEvent) {
    store.dragging = this
  }

  /** Called when the dragging ends */
  onEnd(evt: SortableEvent) {
    store.dragging = null
  }

  /** Called when the `onSpill` plugin is activated */
  onSpill(evt: SortableEvent) {
    const { removeOnSpill, revertOnSpill } = this.props
    if (removeOnSpill && !revertOnSpill) removeNode(evt.item)
  }

  /** Called when a clone is made. It replaces an element in with a function */
  // are we in the same list? if so, do nothing
  onClone(evt: SortableEvent) {}
  onSelect(evt: SortableEvent) {
    // append the class name the classes of the item
    // do it on the item?
    // a seperate state?
  }
  onDeselect(evt: SortableEvent) {
    // remove the clast name of the child
  }
}
