import { Children, cloneElement, Component, ReactNode, ReactElement } from 'react'
import { Options } from 'sortablejs'
import { ReactSortableProps, SortableMethodKeys } from '..'

/**
 * @summary adds the attribute `data-id` to children
 * @param children
 */
export function addDataIDAttributeToChildren(children: ReactNode, dataIdAttr: string | undefined) {
  if (!children || children == null) return null
  return Children.map(children as ReactElement<any>[], (child: ReactElement) =>
    cloneElement(child, { [dataIdAttr || 'data-id']: child.key })
  )
}

/**
 * Removes the `node` from the DOM
 * @param node
 */
export function removeNode(node: HTMLElement) {
  if (node.parentElement !== null) node.parentElement.removeChild(node)
}

/**
 * @summary Inserts a `newChild` inside the `parent` at index number `position`
 * @param parent
 * @param newChild
 * @param position a number that is not negative
 */
export function insertNodeAt(parent: HTMLElement, newChild: HTMLElement, position: number) {
  const refChild = position === 0 ? parent.children[0] : parent.children[position - 1]
  parent.insertBefore(newChild, refChild)
}

// todo:
// add `onSpilled` and other functions, if any, to this exclusion list
// they must also be handled by `ReactSortable.makeOptions`
/**
 * Removes the following group of properties from `props`,
 * leaving only `Sortable.Options` without any `on` methods.
 * @param props `ReactSortable.Props`
 */
export function destructurePropsForOptions<T>(
  props: Component<ReactSortableProps<T>, {}, any>['props']
): Exclude<Options, SortableMethodKeys> {
  const {
    // react sortable props
    list,
    setList,
    children,
    tag,
    style,
    className,
    // sortable options that have methods we want to overwrite
    onAdd,
    onChange,
    onChoose,
    onClone,
    onEnd,
    onFilter,
    onRemove,
    onSort,
    onStart,
    onUnchoose,
    onUpdate,
    onMove,
    onSpill,
    ...options
  } = props
  return options
}
