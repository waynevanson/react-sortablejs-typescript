import { Component } from 'react';
import { ReactSortableProps, SortableMethodKeys } from '..';
import { Options } from 'sortablejs';
/**
 * Removes the `node` from the DOM
 * @param node
 */
export declare function removeNode(node: HTMLElement): void;
/**
 * Uses
 * @param parent
 * @param newChild
 * @param position a number that is not negative
 */
export declare function insertNodeAt(parent: HTMLElement, newChild: HTMLElement, position: number): void;
/**
 * Removes the following group of properties from `props`,
 * leaving only `Sortable.Options` without any `on` methods.
 * @param props `ReactSortable.Props`
 */
export declare function destructurePropsForOptions<T>(props: Component<ReactSortableProps<T>, {}, any>['props']): Exclude<Options, SortableMethodKeys>;
//# sourceMappingURL=index.d.ts.map