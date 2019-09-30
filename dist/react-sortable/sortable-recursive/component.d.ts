import { FC, ReactElement } from 'react';
import { ReactSortableProps, SetStateCallback } from '../react-sortable';
import { GroupOptions } from 'sortablejs';
import { Item } from '..';
/**
 * State is managed for you, so relax!
 *
 * @param props
 */
export declare function SortableRecursive<T extends Item>(props: SortableRecursiveProps<T>): JSX.Element;
export interface SortableRecursiveProps<T extends Item> extends Omit<ReactSortableProps<T>, 'setList' | 'children'> {
    children: ReactSortableChildren<T>;
    depth: number;
    list: T[];
    setRootState: SetStateCallback<T[]>;
    group: string | GroupOptions;
    swapThreshold: number;
}
export interface ReactSortableChildren<T extends Item> {
    (item: T, Nested: FC): ReactElement;
}
//# sourceMappingURL=component.d.ts.map