import { Component, RefAttributes, ForwardRefExoticComponent, CSSProperties, ReactHTML, Dispatch } from 'react';
import Sortable, { Options, SortableEvent } from 'sortablejs';
/**
 * A component for making the first layer of children sortable,
 * using `SortableJS` to manipulate the DOM.
 */
export declare class ReactSortable<T> extends Component<ReactSortableProps<T>> {
    private ref;
    childState: T[] | null;
    constructor(props: ReactSortableProps<T>);
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
    /**
     * Append the props that are options into the options
     */
    makeOptions(): Options;
    /**
     * Returns a function that
     * triggers one of the internal methods
     * when a sortable method is triggered
     */
    callbacksWithOnEvent(evtName: SortableMethodKeysReactHandling): (evt: Sortable.SortableEvent) => void;
    /**
     * Returns a function that triggers when a sortable method is triggered
     */
    callbacks(evtName: Exclude<SortableMethodKeysWithoutMove, SortableMethodKeysReactHandling>): (evt: Sortable.SortableEvent) => void;
}
export interface ReactSortableProps<T> extends NewOptions {
    /**
     * Does not induce any state changes when DOM is updated
     */
    uncontrolled?: boolean;
    list?: T[];
    setList?: SetStateCallback<T[]>;
    /**
     * If parsing in a component WITHOUT a ref, an error will be thrown.
     *
     * To fix this, use the `forwardRef` component.
     *
     * @example
     * forwardRef<HTMLElement, YOURPROPS>((props, ref) => <button ref={ref} />)
     */
    tag?: ForwardRefExoticComponent<RefAttributes<any>> | keyof ReactHTML;
    style?: CSSProperties;
    className?: string;
}
export interface Store {
    dragging: null | ReactSortable<any>;
}
export declare type SetStateCallback<S> = Dispatch<(prevState: S) => S>;
export declare type SortableMethodKeys = 'onAdd' | 'onChoose' | 'onClone' | 'onEnd' | 'onFilter' | 'onMove' | 'onRemove' | 'onSort' | 'onStart' | 'onUnchoose' | 'onUpdate' | 'onChange';
/** Method names that fire in `this`, when this is react-sortable */
declare type SortableMethodKeysReactHandling = 'onAdd' | 'onRemove' | 'onUpdate' | 'onStart' | 'onEnd';
declare type SortableMethodKeysWithoutMove = Exclude<SortableMethodKeys, 'onMove'>;
interface NewSortableMethodMove {
    onMove?: (evt: SortableEvent, originalEvent: Event, store: Store) => boolean | -1 | 0 | 1;
}
declare type NewOptions = Omit<Options, SortableMethodKeys> & NewSortableMethodsWithoutMove & NewSortableMethodMove;
declare type NewSortableMethodsWithoutMove = Partial<Record<SortableMethodKeysWithoutMove, (evt: SortableEvent, store: Store) => void>>;
export {};
//# sourceMappingURL=react-sortable.d.ts.map