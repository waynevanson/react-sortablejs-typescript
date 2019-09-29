import { Component } from 'react'

import { ReactSortableProps } from '../components'

/**
 * Removes the `node` from the DOM
 * @param node
 */
export function removeNode(node: HTMLElement) {
  if (node.parentElement !== null) node.parentElement.removeChild(node)
}

/**
 * Uses
 * @param parent
 * @param newChild
 * @param position a number that is not negative
 */
export function insertNodeAt(parent: HTMLElement, newChild: HTMLElement, position: number) {
  const refChild = position === 0 ? parent.children[0] : parent.children[position - 1]
  parent.insertBefore(newChild, refChild)
}

//

export function destructurePropsForOptions<T>(
  props: Component<ReactSortableProps<any>, {}, any>['props']
) {
  const {
    list,
    setList,
    children,
    tag,
    style,
    className,
    uncontrolled,
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
    ...options
  } = props
  return options
}
