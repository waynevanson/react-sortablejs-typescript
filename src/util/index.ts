/**
 * Removes the `node` from the DOM
 * @param node
 */
export function removeNode(node: HTMLElement) {
  if (node.parentElement !== null) node.parentElement.removeChild(node)
}

/**
 * Uses
 * @param containerNode
 * @param nodeToInsert
 * @param atPosition a number that is not negative
 */
export function insertNodeAt(
  containerNode: HTMLElement,
  nodeToInsert: HTMLElement,
  atPosition: number
) {
  const refNode =
    atPosition === 0
      ? containerNode.children[0]
      : containerNode.children[atPosition - 1].nextSibling
  containerNode.insertBefore(nodeToInsert, refNode)
}

//
