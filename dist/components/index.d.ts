import { Component, RefAttributes, ForwardRefExoticComponent, CSSProperties, ReactHTML } from 'react';
import Sortable, { Options, SortableEvent, MoveEvent } from 'sortablejs';
export declare class ReactSortable extends Component<ReactSortableProps> {
    private ref;
    /**
     * The sortable instance
     */
    readonly sortable: Sortable | HTMLElement | null;
    /**
     * Removes Sortable from the type
     */
    readonly sortableHTML: HTMLElement | null;
    constructor(props: ReactSortableProps);
    componentDidMount(): void;
    render(): import("react").ReactElement<RefAttributes<HTMLElement>, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => Component<any, any, any>)> | null) | (new (props: any) => Component<any, any, any>)>;
    /**
     * Calls the `props.onMove` function
     * @param moveEvt
     */
    triggerOnMove(moveEvt: MoveEvent): void;
    /**
     * Calls the `props.on[add, start, ...etc] function
     * @param evt
     * @param evtName
     */
    triggerOnElse(evt: SortableEvent, evtName: MethodsExcludingMove): void;
    onAdd(evt: SortableEvent): void;
    onRemove(evt: SortableEvent): void;
    onUpdate(evt: SortableEvent): void;
    onStart(evt: SortableEvent): void;
    onEnd(evt: SortableEvent): void;
    /**
     * Append the props that are options into the options
     * @param options
     * @param groupOptions
     */
    makeOptions(): Options;
    /**
     * Returns a function that
     * triggers one of the internal methods
     * when a sortable method is triggered
     */
    callbacksWithOnEvent(evtName: MethodsDOM): (evt: Sortable.SortableEvent) => void;
    /**
     * Returns a function that triggers when a sortable method is triggered
     */
    callbacks(evtName: Exclude<MethodsExcludingMove, MethodsDOM>): (evt: Sortable.SortableEvent) => void;
}
export interface ReactSortableProps extends Options {
    state: Item[] | undefined;
    setState: (newItems: Item[]) => void;
    /**
     * If parsing in a component WITHOUT a ref, an error will be thrown.
     *
     * To fix this, use the `forwardRef` component.
     *
     * @example
     * forwardRef<HTMLElement, YOURPROPS>((props, ref) => <button ref={ref} />)
     */
    tag?: ForwardRefExoticComponent<RefAttributes<HTMLElement>> | keyof ReactHTML;
    style?: CSSProperties;
    className?: string;
}
export interface Item {
    id: string;
    children?: Item[];
    [key: string]: any;
}
export declare type OptionsExcludingGroup = Omit<Options, 'group'>;
export declare type MethodsExcludingMove = Exclude<Methods, 'onMove'>;
/** Method names that change the DOM */
export declare type MethodsDOM = 'onAdd' | 'onRemove' | 'onUpdate' | 'onStart' | 'onEnd';
export declare type Methods = 'onAdd' | 'onChoose' | 'onClone' | 'onEnd' | 'onFilter' | 'onMove' | 'onRemove' | 'onSort' | 'onStart' | 'onUnchoose' | 'onUpdate';
//# sourceMappingURL=index.d.ts.map