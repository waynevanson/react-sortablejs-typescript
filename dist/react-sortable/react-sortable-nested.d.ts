import { Dispatch, SetStateAction } from 'react';
import { SortableRecursiveProps } from './sortable-recursive';
import { Item } from '.';
export declare function ReactSortableNested<T extends Item>(props: ReactSortableNestedProps<T>): JSX.Element;
export interface ReactSortableNestedProps<T extends Item> extends Omit<SortableRecursiveProps<T>, 'rootState' | 'setRootState' | 'path'> {
    /**
     * A list of items, should have be an OBJECT and have and ID, with children optional
     */
    list: T[];
    /**
     * The setState function
     */
    setList: Dispatch<SetStateAction<T[]>>;
}
/**
 * This is the recommended list item type.
 * implement or extend this when creating your own.
 */
export interface Item {
    id: string;
    children: Item[];
    [key: string]: any;
}
//# sourceMappingURL=react-sortable-nested.d.ts.map