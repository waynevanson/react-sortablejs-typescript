import React, { FC, ReactElement, Dispatch, SetStateAction } from 'react';
import { ReactSortableProps } from '../react-sortable';
import { GroupOptions } from 'sortablejs';
import { Item } from '..';
/**
 * State is managed for you, so relax!
 *
 * @param props
 */
export declare function SortableRecursive<T extends Item>(props: SortableRecursiveProps<T>): JSX.Element;
export declare function useForceUpdate(): () => void;
export declare function useHandleChild<T extends Item>(props: SortableRecursiveProps<T>): (id: string, path: number[]) => React.Dispatch<React.SetStateAction<T[]>>;
export declare function findListById<T extends Item>(rootState: T[], path: number[], id: string, d?: number): T[] | undefined;
export declare function replaceList<T extends Item>(rootState: T[], newContextState: T[], path: number[], id: string, d?: number): T[];
export interface SortableRecursiveProps<T extends Item> extends Omit<ReactSortableProps<T>, 'children' | 'setList'> {
    children: ReactSortableChildren<T>;
    path: number[];
    list: T[];
    setList: Dispatch<SetStateAction<T[]>>;
    group: string | GroupOptions;
    swapThreshold: number;
}
export interface ReactSortableChildren<T extends Item> {
    (params: ReactSortableChildrenProps<T>): ReactElement;
}
export interface ReactSortableChildrenProps<T extends Item> {
    list: T[];
    item: T;
    Nested: FC;
    depth: number;
    index: number;
    path: number[];
}
//# sourceMappingURL=component.d.ts.map