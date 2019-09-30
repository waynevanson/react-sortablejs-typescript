import { Item, Store } from '..';
import { SortableRecursiveProps } from '.';
import { SortableEvent } from 'sortablejs';
export declare function useHandlers<T extends Item>(props: SortableRecursiveProps<T>, sorting: UseSorting): ActionHandlers;
interface UseSorting {
    handleAddToState: (evt: SortableEvent, store: Store) => void;
    handleRemoveFromState: (evt: SortableEvent) => void;
    handleUpdateTheState: (evt: SortableEvent, store: Store) => void;
}
export declare function useSorting<T extends Item>(props: SortableRecursiveProps<T>, depth: number): {
    handleAddToState: (evt: SortableEvent, store: Store) => void;
    handleRemoveFromState: (evt: SortableEvent) => void;
    handleUpdateTheState: (evt: SortableEvent, store: Store) => void;
};
export declare function addToState<T extends Item>(params: AddToStateParams<T>): T[];
export declare function removeFromState<T extends Item>(params: RemoveFromStateParams<T>): T[];
declare type ActionHandlers = Record<'onAdd' | 'onRemove' | 'onUpdate', (evt: SortableEvent, store: Store) => void>;
interface RemoveFromStateParams<T extends Item> {
    state: T[];
    index: number;
    depth: number;
    currentDepth: number;
}
interface AddToStateParams<T extends Item> extends RemoveFromStateParams<T> {
    refItem: T;
}
export {};
//# sourceMappingURL=hooks.d.ts.map