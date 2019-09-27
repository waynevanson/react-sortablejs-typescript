import { FC, ReactElement } from 'react';
import { Item, ReactSortableProps } from './react-sortable';
import { GroupOptions } from 'sortablejs';
export declare function ReactSortableNested<T extends Item>(props: ReactSortableNestedProps<T>): JSX.Element;
export interface ReactSortableNestedProps<T> extends ReactSortableProps<T> {
    children: (item: T, Nested: FC) => ReactElement;
    state: T[];
    group: string | GroupOptions;
    swapThreshold: number;
}
//# sourceMappingURL=react-sortable-nested.d.ts.map