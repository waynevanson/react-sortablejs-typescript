import { Component, RefAttributes, ForwardRefExoticComponent } from 'react';
import Sortable, { Options, GroupOptions, SortableEvent, MoveEvent } from 'sortablejs';
export declare class ReactSortable extends Component<ReactSortableProps> {
    private ref;
    readonly sortable: HTMLElement | null;
    constructor(props: ReactSortableProps);
    componentDidMount(): void;
    render(): import("react").ReactElement<RefAttributes<HTMLElement>, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => Component<any, any, any>)> | null) | (new (props: any) => Component<any, any, any>)>;
    triggerOnMove(moveEvt: MoveEvent): void;
    triggerOnElse(evt: SortableEvent, evtName: SortableMethodsNoMove): void;
    onAdd(evt: SortableEvent): void;
    onRemove(evt: SortableEvent): void;
    onUpdate(evt: SortableEvent): void;
    onStart(evt: SortableEvent): void;
    onEnd(evt: SortableEvent): void;
    makeOptions(options?: PropOptions, groupOptions?: GroupOptions): Options;
    /**
     * Returns a function that triggers **a DOM change** when a sortable method is triggered
     */
    deliverCallbacks(evtName: Delgationss): (evt: Sortable.SortableEvent) => void;
    /**
     * Returns a function that triggers when a sortable method is triggered
     */
    justEmit(evtName: Exclude<SortableMethodsNoMove, Delgationss>): (evt: Sortable.SortableEvent) => void;
}
export interface ReactSortableProps extends ExtractedProps {
    state: Item[];
    setState: (newItems: Item[]) => void;
    /**
     * This excludes `options.group`.
     * Instead, use the `group` prop for this component.
     */
    options?: PropOptions;
    groupOptions?: GroupOptions;
    tag?: ForwardRefExoticComponent<RefAttributes<HTMLElement>>;
    plugins?: any[];
}
export interface Item {
    id: string;
    children?: Item[];
    [key: string]: any;
}
export declare type PropOptions = Omit<Options, 'group'>;
export declare type ExtractedProps = Pick<Options, SortableMethods>;
export declare type SortableMethods = 'onAdd' | 'onChoose' | 'onClone' | 'onEnd' | 'onFilter' | 'onMove' | 'onRemove' | 'onSort' | 'onStart' | 'onUnchoose' | 'onUpdate';
export declare type SortableMethodsNoMove = Exclude<SortableMethods, 'onMove'>;
export declare type Delgationss = 'onAdd' | 'onRemove' | 'onUpdate' | 'onStart' | 'onEnd';
//# sourceMappingURL=index.d.ts.map