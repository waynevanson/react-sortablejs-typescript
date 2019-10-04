import { Component, RefAttributes, ForwardRefExoticComponent, CSSProperties, ReactHTML } from "react";
import Sortable, { Options, SortableEvent } from "sortablejs";
/**
 * A component for making the first layer of children sortable,
 * using `SortableJS` to manipulate the DOM.
 */
export declare class ReactSortable<T> extends Component<ReactSortableProps<T>> {
    private ref;
    constructor(props: ReactSortableProps<T>);
    private readonly sortable;
    componentDidMount(): void;
    render(): import("react").ReactElement<RefAttributes<any>, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => Component<any, any, any>)> | null) | (new (props: any) => Component<any, any, any>)>;
    /**
     * Calls the `props.on[add | start | ...etc]` function
     * @param evt
     * @param evtName
     */
    triggerOnElse(evt: SortableEvent, evtName: SortableMethodKeysWithoutMove): void;
    onAdd(evt: SortableEvent): void;
    onRemove(evt: SortableEvent): void;
    onUpdate(evt: SortableEvent): void;
    onStart(evt: SortableEvent): void;
    onEnd(evt: SortableEvent): void;
    onSpill(evt: SortableEvent): void;
    onClone(evt: SortableEvent): void;
    /**
     * Append the props that are options into the options
     */
    makeOptions(): Options;
    /**
     * Returns a function that
     * triggers one of the `ReactSortable` internal methods
     * when a sortable method is triggered
     */
    callbacksWithOnEvent(evtName: SortableMethodKeysReact): (evt: Sortable.SortableEvent) => void;
    /**
     * Returns a function that triggers when a sortable method is triggered
     */
    callbacks(evtName: Exclude<SortableMethodKeysWithoutMove, SortableMethodKeysReact>): (evt: Sortable.SortableEvent) => void;
}
export interface ReactSortableProps<T> extends ReactSortableOptions {
    /**
     * The list of items to use.
     */
    list: T[];
    /**
     * Sets the state for your list of items.
     */
    setList: (newState: T[], sortable: Sortable | null, store: Store) => void;
    /**
     * If parsing in a component WITHOUT a ref, an error will be thrown.
     *
     * To fix this, use the `forwardRef` component.
     *
     * @example
     * forwardRef<HTMLElement, YOURPROPS>((props, ref) => <button {...props} ref={ref} />)
     */
    tag?: ForwardRefExoticComponent<RefAttributes<any>> | keyof ReactHTML;
    style?: CSSProperties;
    className?: string;
    /**
     * Parse the plugins you'd like to use in Sortable.
     */
    plugins?: Sortable.Plugin<any> | Array<Sortable.Plugin<any>>;
}
/**
 * Used as
 */
export interface Store {
    dragging: null | ReactSortable<any>;
}
/**
 * Change the `on[...]` methods in Sortable.Options,
 * so that they all have an extra arg that is `store: Store`
 */
declare type ReactSortableOptions = Omit<Options, SortableMethodKeys> & Partial<Record<SortableMethodKeysWithoutMove, (evt: SortableEvent, sortable: Sortable | null, store: Store) => void>> & {
    onMove?: (evt: SortableEvent, originalEvent: Event, sortable: Sortable | null, store: Store) => boolean | -1 | 1;
};
/** All method names starting with `on` in `Sortable.Options` */
export declare type SortableMethodKeys = "onAdd" | "onChange" | "onChoose" | "onClone" | "onEnd" | "onFilter" | "onMove" | "onRemove" | "onSort" | "onSpill" | "onStart" | "onUnchoose" | "onUpdate";
/** Method names that fire in `this`, when this is react-sortable */
declare type SortableMethodKeysReact = "onAdd" | "onRemove" | "onUpdate" | "onStart" | "onEnd" | "onSpill";
/**
 * Same as `SortableMethodKeys` type but with out the string `onMove`.
 */
declare type SortableMethodKeysWithoutMove = Exclude<SortableMethodKeys, "onMove">;
export {};
//# sourceMappingURL=react-sortable.d.ts.map