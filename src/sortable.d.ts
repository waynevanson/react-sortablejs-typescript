import 'sortablejs'
import { SortableEvent, MoveEvent, SortablePlugin, SortableEvent, SortableEvent } from 'sortablejs'

declare module 'sortablejs' {
  export interface Options extends OnSpillOptions, AutoScrollOptions {
    /**
     * Only delay if user is using touch
     */
    delayOnTouchOnly?: boolean
    /**
     * How many *pixels* the point should move before cancelling a delayed drag event
     */
    touchStartThreshold?: number
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
     * Threshold of the swap zone.
     * Defaults to `1`
     */
    swapThreshold?: number
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
     * Direction of Sortable
     * (will be detected automatically if not given)
     */
    direction?: 'horizontal' | 'vertical'
    /**
     * Remove the clone element when it is not showing,
     * rather than just hiding it
     */
    removeCloneOnHide?: true
    /**
     * distance mouse must be from empty sortable
     * to insert drag element into it
     */
    emptyInsertThreshold?: number

    onMove?: (evt: MoveEvent, originalEvent: Event) => boolean | -1 | 0 | 1
    /**
     * Called when dragging element changes position
     */
    onChange?: (evt: SortableEvent) => void
  }
}

interface OnSpillOptions {
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
  onSpill?: (evt: SortableEvent) => void
}

interface AutoScrollOptions {
  /**
   *  Enable the plugin. Can be `HTMLElement`.
   */
  scroll?: boolean | HTMLElement
  /**
   * if you have custom scrollbar scrollFn may be used for autoscrolling
   */
  scrollFn?: ScrollFn
  /**
   * how near the mouse must be to an edge to start scrolling.
   */
  scrollSensitivity?: number
  /**
   * speed of the scrolling
   */
  scrollSpeed?: number
  /**
   * apply autoscroll to all parent elements, allowing for easier movement
   */
  bubbleScroll?: boolean
}

interface ScrollFn {
  (
    offsetX: number,
    offsetY: number,
    originalEvent: Event,
    touchEvt: SortableEvent,
    hoverTargetEl: HTMLElement
  ): 'continue' | void
}
