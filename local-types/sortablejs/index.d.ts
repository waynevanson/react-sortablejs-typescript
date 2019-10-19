// Type definitions for Sortable.js 1.10
// Project: https://github.com/RubaXa/Sortable
// Definitions by: Maw-Fox <https://github.com/Maw-Fox>
//                 Maarten Staa <https://github.com/maartenstaa>
//                 Wayne Van Son <https://github.com/waynevanson>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.1

// todo:
// tests
// more plugins
// more plugin options

export = Sortable

declare class Sortable {
  public options: Sortable.Options
  public el: HTMLElement

  /**
   * Sortable's main constructor.
   * @param element Any variety of HTMLElement.
   * @param options Sortable options object.
   */
  constructor(element: HTMLElement, options: Sortable.Options)

  static active: Sortable
  static utils: Sortable.Utils

  /**
   * Creation of new instances.
   * @param element Any variety of HTMLElement.
   * @param options Sortable options object.
   */
  static create(element: HTMLElement, options: Sortable.Options): Sortable

  /**
   * Mounts a plugin to the `Sortable`
   * @param plugins One or more of the sortable plugins.
   */
  static mount(...plugins: Sortable.Plugin<any>[]): void

  /**
   * Options getter/setter
   * @param name a Sortable.Options property.
   * @param value a value.
   */
  option<K extends keyof Sortable.Options>(name: K, value: Sortable.Options[K]): void
  option<K extends keyof Sortable.Options>(name: K): Sortable.Options[K]

  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param element an HTMLElement or selector string.
   * @param selector default: `options.draggable`
   */
  closest(element: HTMLElement, selector?: string): HTMLElement | null

  /**
   * Sorts the elements according to the array.
   * @param order an array of strings to sort.
   */
  sort(order: ReadonlyArray<string>): void

  /**
   * Saving and restoring of the sort.
   */
  save(): void

  /**
   * Removes the sortable functionality completely.
   */
  destroy(): void

  /**
   * Serializes the sortable's item data-id's (dataIdAttr option) into an array of string.
   */
  toArray(): string[]
}

// all options

declare namespace Sortable {
  /**
   * Use to create a plugin in SortableJS
   *
   * https://github.com/SortableJS/Sortable/blob/master/plugins/README.md
   */
  // todo: research implementation of creating plugins, to allow inference of types
  class Plugin<O extends Object> {
    /**
     *
     * @param sortable
     * @param el
     * @param options
     *
     */
    constructor(sortable?: Sortable, el?: HTMLElement, options?: O)

    /**
     * Required. The name of the plugin
     */
    static pluginName: string

    static utils?: Object
    static eventOptions(eventName: string): Function
    static initializeByDefault: boolean
    static optionListeners: Options & { [key: string]: any }
    /**
     * https://github.com/SortableJS/Sortable/blob/master/plugins/README.md#plugin-options
     */
    defaults?: Options & O
    /**
     * https://github.com/SortableJS/Sortable/blob/master/plugins/README.md#plugin-options
     */
    sortable: Sortable
    options: Options & O & { [key: string]: any }
    /**
     * Is this correct?
     *
     * https://github.com/SortableJS/Sortable/blob/master/plugins/README.md#event-list
     */
    filter(evt: SortablePluginEvent): void
    delayStart(evt: SortablePluginEvent): void
    delayEnded(evt: SortablePluginEvent): void
    setupClone(evt: SortablePluginEvent): void

    dragStart(evt: SortablePluginEvent): void
    clone(evt: SortablePluginEvent): void
    dragStarted(evt: SortablePluginEvent): void
    dragOver(evt: SortablePluginEvent): void
    dragOverValid(evt: SortablePluginEvent): void
    revert(evt: SortablePluginEvent): void
    dragOverComplete(evt: SortablePluginEvent & { insertion: boolean }): void
    dragOverAnimationCapture(evt: SortablePluginEvent): void
    dragOverAnimationComplete(evt: SortablePluginEvent): void
    drop(evt: SortablePluginEvent): void
    nulling(evt: SortablePluginEvent): void
    destroy(evt: SortablePluginEvent): void
  }
  class AutoScrollPlugin extends Plugin<AutoScrollOptions> {
    static pluginName: 'scroll'
    static initializeByDefault: true
    defaults: {
      scroll: true
      scrollSensitivity: 30
      scrollSpeed: 10
      bubbleScroll: true
    }
    private _handleFallbackAutoScroll(evt: SortableEvent): void
    private _handleAutoScroll(evt: SortableEvent, fallBack): void
  }
  class OnSpillPlugin extends Plugin<OnSpillOptions> {
    static pluginName: 'revertOnSpill'
    startIndex: number | null
  }
  class MultiDrag extends Plugin<MultiDragOptions> {
    static pluginName: 'multiDrag'
  }
  // OPTIONS
  export interface Options extends SortableOptions, OnSpillOptions, AutoScrollOptions,MultiDragOptions {}

  type PullResult = ReadonlyArray<string> | boolean | 'clone'
  type PutResult = ReadonlyArray<string> | boolean
  export interface GroupOptions {
    /**
     * group name
     */
    name: string
    /**
     * ability to move from the list. clone — copy the item, rather than move.
     */
    pull?: PullResult | ((to: Sortable, from: Sortable) => PullResult)
    /**
     * whether elements can be added from other lists, or an array of group names from which elements can be taken.
     */
    put?: ((to: Sortable) => PutResult) | PutResult
    /**
     * revert cloned element to initial position after moving to a another list.
     */
    revertClone?: boolean
  }
  type Direction = 'vertical' | 'horizontal'
  export interface SortableOptions {
    /**
     * ms, animation speed moving items when sorting, `0` — without animation
     */
    animation?: number
    /**
     * Class name for the chosen item
     */
    chosenClass?: string
    dataIdAttr?: string
    /**
     * time in milliseconds to define when the sorting should start
     */
    delay?: number
    /**
     * Only delay if user is using touch
     */
    delayOnTouchOnly?: boolean
    /**
     * Direction of Sortable
     * (will be detected automatically if not given)
     */
    direction?:
      | ((evt: SortableEvent, target: HTMLElement, dragEl: HTMLElement) => Direction)
      | Direction
    /**
     * Disables the sortable if set to true.
     */
    disabled?: boolean
    /**
     * Class name for the dragging item
     */
    dragClass?: string
    /**
     * Specifies which items inside the element should be draggable
     */
    draggable?: string
    dragoverBubble?: boolean
    dropBubble?: boolean
    /**
     * distance mouse must be from empty sortable
     * to insert drag element into it
     */
    emptyInsertThreshold?: number

    /**
     * Easing for animation. Defaults to null.
     *
     * See https://easings.net/ for examples.
     *
     * For other possible values, see
     * https://www.w3schools.com/cssref/css3_pr_animation-timing-function.asp
     *
     * @example
     *
     * // CSS functions
     * | 'steps(int, start | end)'
     * | 'cubic-bezier(n, n, n, n)'
     *
     * // CSS values
     * | 'linear'
     * | 'ease'
     * | 'ease-in'
     * | 'ease-out'
     * | 'ease-in-out'
     * | 'step-start'
     * | 'step-end'
     * | 'initial'
     * | 'inherit'
     */
    easing?: string
    /**
     * Class name for the cloned DOM Element when using forceFallback
     */
    fallbackClass?: string
    /**
     * Appends the cloned DOM Element into the Document's Body
     */
    fallbackOnBody?: boolean
    /**
     * Specify in pixels how far the mouse should move before it's considered as a drag.
     */
    fallbackTolerance?: number
    fallbackOffset?: { x: number; y: number }
    /**
     * Selectors that do not lead to dragging (String or Function)
     */
    filter?:
      | string
      | ((
          this: Sortable,
          event: Event | TouchEvent,
          target: HTMLElement,
          sortable: Sortable
        ) => boolean)
    /**
     * ignore the HTML5 DnD behaviour and force the fallback to kick in
     */
    forceFallback?: boolean
    /**
     * Class name for the drop placeholder
     */
    ghostClass?: string
    /**
     * To drag elements from one list into another, both lists must have the same group value.
     * You can also define whether lists can give away, give and keep a copy (clone), and receive elements.
     */
    group?: string | GroupOptions
    /**
     * Drag handle selector within list items
     */
    handle?: string
    ignore?: string
    /**
     * Will always use inverted swap zone if set to true
     */
    invertSwap?: boolean
    /**
     * Threshold of the inverted swap zone
     * (will be set to `swapThreshold` value by default)
     */
    invertedSwapThreshold?: number
    /**
     * Call `event.preventDefault()` when triggered `filter`
     */
    preventOnFilter?: boolean
    /**
     * Remove the clone element when it is not showing,
     * rather than just hiding it
     */
    removeCloneOnHide?: boolean
    /**
     * sorting inside list
     */
    sort?: boolean
    store?: {
      get: (sortable: Sortable) => string[]
      set: (sortable: Sortable) => void
    }
    /**
     * Threshold of the swap zone.
     * Defaults to `1`
     */
    swapThreshold?: number
    /**
     * How many *pixels* the point should move before cancelling a delayed drag event
     */
    touchStartThreshold?: number

    setData?: (dataTransfer: DataTransfer, draggedElement: HTMLElement) => void
    /**
     * Element dragging started
     */
    onStart?: (event: SortableEvent) => void
    /**
     * Element dragging ended
     */
    onEnd?: (event: SortableEvent) => void
    /**
     * Element is dropped into the list from another list
     */
    onAdd?: (event: SortableEvent) => void
    /**
     * Created a clone of an element
     */
    onClone?: (event: SortableEvent) => void
    /**
     * Element is chosen
     */
    onChoose?: (event: SortableEvent) => void
    /**
     * Element is unchosen
     */
    onUnchoose?: (event: SortableEvent) => void
    /**
     * Changed sorting within list
     */
    onUpdate?: (event: SortableEvent) => void
    /**
     * Called by any change to the list (add / update / remove)
     */
    onSort?: (event: SortableEvent) => void
    /**
     * Element is removed from the list into another list
     */
    onRemove?: (event: SortableEvent) => void
    /**
     * Attempt to drag a filtered element
     */
    onFilter?: (event: SortableEvent) => void
    /**
     * Event when you move an item in the list or between lists
     */
    onMove?: (evt: MoveEvent, originalEvent: Event) => boolean | -1 | 1
    /**
     * Called when dragging element changes position
     */
    onChange?: (evt: SortableEvent) => void
  }
  export interface AutoScrollOptions {
    /**
     *  Enable the plugin. Can be `HTMLElement`.
     */
    scroll?: boolean | HTMLElement
    /**
     * if you have custom scrollbar scrollFn may be used for autoscrolling.
     */
    scrollFn?: (
      this: Sortable,
      offsetX: number,
      offsetY: number,
      originalEvent: Event,
      touchEvt: TouchEvent,
      hoverTargetEl: HTMLElement
    ) => 'continue' | void
    /**
     * `px`, how near the mouse must be to an edge to start scrolling.
     */
    scrollSensitivity?: number
    /**
     * `px`, speed of the scrolling.`
     */
    scrollSpeed?: number
    /**
     * apply autoscroll to all parent elements, allowing for easier movement.
     */
    bubbleScroll?: boolean
  }

  export interface OnSpillOptions {
    /**
     * This plugin, when enabled,
     * will cause the dragged item to be reverted to it's original position if it is *spilled*
     * (ie. it is dropped outside of a valid Sortable drop target)
     */
    revertOnSpill?: boolean
    /**
     * This plugin, when enabled,
     * will cause the dragged item to be removed from the DOM if it is *spilled*
     * (ie. it is dropped outside of a valid Sortable drop target)
     */
    removeOnSpill?: boolean
    /**
     * Called when either `revertOnSpill` or `RemoveOnSpill` plugins are enabled.
     */
    onSpill?: (evt: SortableEvent) => void
  }
  export interface MultiDragOptions {
    /**
     * Enable the plugin
     */
    multiDrag?: boolean
    /**
     * Class name for selected item
     */
    selectedClass?: string
    /**
     * Key that must be down for items to be selected
     */
    // todo: create a type
    // todo: check source code for type
    multiDragKey?: null

    /**
     * Called when an item is selected
     */
    onSelect?: (event: SortableEvent) => void

    /**
     * Called when an item is deselected
     */
    onDeselect?: (event: SortableEvent) => void
  }

  // EVENTS
  export interface SortableEvent extends Event {
    clone: HTMLElement
    /**
     * previous list
     */
    from: HTMLElement
    /**
     * dragged element
     */
    item: HTMLElement
    /**
     * new index within parent
     */
    newIndex: number | undefined
    /**
     * old index within parent
     */
    oldIndex: number | undefined
    target: HTMLElement
    /**
     * list, in which moved element.
     */
    to: HTMLElement
  }

  export interface MoveEvent extends Event {
    dragged: HTMLElement
    draggedRect: DOMRect
    from: HTMLElement
    /**
     * element on which have guided
     */
    related: HTMLElement
    relatedRect: DOMRect
    to: HTMLElement
    willInsertAfter?: boolean
  }
  /**
   * An object with the following properties is passed as an argument to each plugin event when it is fired.
   *
   * https://github.com/SortableJS/Sortable/blob/master/plugins/README.md#event-object
   */
  export interface SortablePluginEvent {
    dragEl: HTMLElement
    parentEl: HTMLElement
    ghostEl: HTMLElement | undefined
    rootEl: HTMLElement | undefined
    nextEl: HTMLElement
    cloneEl: HTMLElement | undefined
    cloneHidden: boolean
    dragStarted: boolean
    putSortable: Sortable | undefined
    activeSortable: Sortable
    originalEvent: Event
    // not undefinable?
    oldIndex: number
    oldDraggableIndex: number
    newIndex: number
    newDraggableIndex: number

    cloneNowHidden: () => void
    cloneNowShown: () => void
    hideGhostForTarget: () => void
    unhideGhostForTarget: () => void
    dispatchSortableEvent: (eventName: String) => void
  }
  export interface MultiDragEvent extends SortablePluginEvent {
    /**
     * Array of selected items, or empty
     */
    items: HTMLElement[]
    /**
     * Array of clones, or empty
     */
    clones: HTMLElement[]
    /**
     * Array containing information on the old indicies of the selected elements.
     */
    oldIndicies: Index[]
    /**
     * Array containing information on the new indicies of the selected elements.
     * 
     * For any event that is fired during sorting, the index of any selected element that is not the main dragged element is given as -1.
     * This is because it has either been removed from the DOM, or because it is in a folding animation (folding to the dragged element) and will be removed after this animation is complete.
     * 
     */
    newIndicies: Index[]
  }
  export interface Index {
    element: HTMLElement
    index: number
  }
  /**
   * This event is passed to dragover events, and extends the normal event object.
   *
   * https://github.com/SortableJS/Sortable/blob/master/plugins/README.md#dragoverevent-object
   */
  export interface DragOverEvent extends Event {
    isOwner: boolean
    axis: 'vertical' | 'horizontal'
    revert: boolean
    dragRect: DOMRect
    targetRect: DOMRect
    canSort: boolean
    fromSortable: Sortable
    target: HTMLElement

    // assumed return value types are the same as `options.onMove()`
    onMove: (target: HTMLElement, after: boolean) => boolean | -1 | 1
    changed: () => void
    completed: (insertion: boolean) => void
  }
  export interface DOMRect {
    bottom: number
    height: number
    left: number
    right: number
    top: number
    width: number
    x: number
    y: number
  }
  export interface Utils {
    /**
     * Attach an event handler function
     * @param element an HTMLElement.
     * @param event an Event context.
     * @param fn
     */
    on(element: HTMLElement, event: string, fn: EventListenerOrEventListenerObject): void

    /**
     * Remove an event handler function
     * @param element an HTMLElement.
     * @param event an Event context.
     * @param fn a callback.
     */
    off(element: HTMLElement, event: string, fn: EventListenerOrEventListenerObject): void

    /**
     * Get the values of all the CSS properties.
     * @param element an HTMLElement.
     */
    css(element: HTMLElement): CSSStyleDeclaration

    /**
     * Get the value of style properties.
     * @param element an HTMLElement.
     * @param prop a property key.
     */
    css<K extends keyof CSSStyleDeclaration>(element: HTMLElement, prop: K): CSSStyleDeclaration[K]

    /**
     * Set one CSS property.
     * @param element an HTMLElement.
     * @param prop a property key.
     * @param value a property value.
     */
    css<K extends keyof CSSStyleDeclaration>(
      element: HTMLElement,
      prop: K,
      value: CSSStyleDeclaration[K]
    ): void

    /**
     * Get elements by tag name.
     * @param context an HTMLElement.
     * @param tagName A tag name.
     * @param iterator An iterator.
     */
    find(
      context: HTMLElement,
      tagName: string,
      iterator?: (value: HTMLElement, index: number) => void
    ): NodeListOf<HTMLElement>

    /**
     * Check the current matched set of elements against a selector.
     * @param element an HTMLElement.
     * @param selector an element selector.
     */
    is(element: HTMLElement, selector: string): boolean

    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * @param element an HTMLElement.
     * @param selector an element seletor.
     * @param context a specific element's context.
     */
    closest(element: HTMLElement, selector: string, context?: HTMLElement): HTMLElement | null

    /**
     * Add or remove one classes from each element
     * @param element an HTMLElement.
     * @param name a class name.
     * @param state a class's state.
     */
    toggleClass(element: HTMLElement, name: string, state: boolean): void
  }
}
