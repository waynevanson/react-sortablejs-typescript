import { createElement, createRef, Component } from 'react';
import Sortable from 'sortablejs';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/**
 * Removes the `node` from the DOM
 * @param node
 */
function removeNode(node) {
    if (node.parentElement !== null)
        node.parentElement.removeChild(node);
}
// todo:
// check how insert before works when refchild is undefined
// as in `parent.children[0]`
/**
 * Uses
 * @param parent
 * @param newChild
 * @param position a number that is not negative
 */
function insertNodeAt(parent, newChild, position) {
    var refChild = position === 0 ? parent.children[0] : parent.children[position - 1];
    parent.insertBefore(newChild, refChild);
}
// todo:
// add `onSpilled` and other functions, if any, to this exclusion list
// they must also be handled by `ReactSortable.makeOptions`
/**
 * Removes the following group of properties from `props`,
 * leaving only `Sortable.Options` without any `on` methods.
 * @param props `ReactSortable.Props`
 */
function destructurePropsForOptions(props) {
    var 
    // react sortable props
    list = props.list, setList = props.setList, children = props.children, tag = props.tag, style = props.style, className = props.className, 
    // sortable options that have methods we want to overwrite
    onAdd = props.onAdd, onChange = props.onChange, onChoose = props.onChoose, onClone = props.onClone, onEnd = props.onEnd, onFilter = props.onFilter, onRemove = props.onRemove, onSort = props.onSort, onStart = props.onStart, onUnchoose = props.onUnchoose, onUpdate = props.onUpdate, onMove = props.onMove, onSpill = props.onSpill, options = __rest(props, ["list", "setList", "children", "tag", "style", "className", "onAdd", "onChange", "onChoose", "onClone", "onEnd", "onFilter", "onRemove", "onSort", "onStart", "onUnchoose", "onUpdate", "onMove", "onSpill"]);
    return options;
}

// add option to store this in context, instead of here.
var store = { dragging: null };
/**
 * A component for making the first layer of children sortable,
 * using `SortableJS` to manipulate the DOM.
 */
// todo: clone function from props
var ReactSortable = /** @class */ (function (_super) {
    __extends(ReactSortable, _super);
    function ReactSortable(props) {
        var _this = _super.call(this, props) || this;
        _this.ref = createRef();
        return _this;
    }
    Object.defineProperty(ReactSortable.prototype, "sortable", {
        get: function () {
            var el = this.ref.current;
            if (el === null)
                return null;
            var key = Object.keys(el).find(function (k) { return k.includes("Sortable"); });
            if (!key)
                return null;
            //@ts-ignore
            return el[key];
        },
        enumerable: true,
        configurable: true
    });
    ReactSortable.prototype.componentDidMount = function () {
        if (this.ref.current === null)
            return;
        var newOptions = this.makeOptions();
        Sortable.create(this.ref.current, newOptions);
        // mount plugins if parsed
        var plugins = this.props.plugins;
        if (!plugins)
            return;
        if (plugins instanceof Array)
            Sortable.mount.apply(Sortable, __spread(plugins));
        else
            Sortable.mount(plugins);
    };
    ReactSortable.prototype.render = function () {
        var _a = this.props, tag = _a.tag, children = _a.children, style = _a.style, className = _a.className;
        var classicProps = { style: style, className: className };
        var tagCheck = !tag || tag === null ? "div" : tag;
        // todo: add data-id to children
        return createElement(tagCheck, __assign({ ref: this.ref }, classicProps), children);
    };
    /**
     * Calls the `props.on[add | start | ...etc]` function
     * @param evt
     * @param evtName
     */
    ReactSortable.prototype.triggerOnElse = function (evt, evtName) {
        var propEvent = this.props[evtName];
        if (propEvent)
            propEvent(evt, this.sortable, store);
    };
    // Element is dropped into the list from another list
    ReactSortable.prototype.onAdd = function (evt) {
        var _a = this.props, list = _a.list, setList = _a.setList;
        // remove from this list,
        removeNode(evt.item);
        // add item to the `props.state`
        var newState = __spread(list);
        var newItem = store.dragging.props.list[evt.oldIndex];
        newState.splice(evt.newIndex, 0, newItem);
        setList(newState, this.sortable, store);
    };
    // Element is removed from the list into another list
    ReactSortable.prototype.onRemove = function (evt) {
        var item = evt.item, from = evt.from, oldIndex = evt.oldIndex;
        insertNodeAt(from, item, oldIndex);
        var _a = this.props, list = _a.list, setList = _a.setList;
        // remove item in the `props.state`fromComponent
        var newState = __spread(list);
        newState.splice(oldIndex, 1);
        setList(newState, this.sortable, store);
    };
    // Changed sorting within list
    // basically the add and remove for actions in the same list
    ReactSortable.prototype.onUpdate = function (evt) {
        removeNode(evt.item);
        insertNodeAt(evt.from, evt.item, evt.oldIndex);
        var _a = this.props, list = _a.list, setList = _a.setList;
        // remove and add items to the `props.state`
        var newState = __spread(list);
        var _b = __read(newState.splice(evt.oldIndex, 1), 1), oldItem = _b[0];
        newState.splice(evt.newIndex, 0, oldItem);
        setList(newState, this.sortable, store);
    };
    ReactSortable.prototype.onStart = function (evt) {
        store.dragging = this;
    };
    ReactSortable.prototype.onEnd = function (evt) {
        store.dragging = null;
    };
    ReactSortable.prototype.onSpill = function (evt) {
        var _a = this.props, removeOnSpill = _a.removeOnSpill, revertOnSpill = _a.revertOnSpill;
        if (removeOnSpill && !revertOnSpill)
            removeNode(evt.item);
    };
    ReactSortable.prototype.onClone = function (evt) { };
    /**
     * Append the props that are options into the options
     */
    ReactSortable.prototype.makeOptions = function () {
        var _this = this;
        var removers = ["onAdd", "onUpdate", "onRemove", "onStart", "onEnd"];
        var norms = [
            "onUnchoose",
            "onChoose",
            "onClone",
            "onFilter",
            "onSort",
            "onChange"
        ];
        var options = destructurePropsForOptions(this.props);
        var newOptions = options;
        removers.forEach(function (name) { return (newOptions[name] = _this.callbacksWithOnEvent(name)); });
        norms.forEach(function (name) { return (newOptions[name] = _this.callbacks(name)); });
        // todo: add `onMove`. Types are cooked on this one not sure why...
        // todo: add `onSpill` methods and DOM changes
        return __assign({}, newOptions);
    };
    /**
     * Returns a function that
     * triggers one of the `ReactSortable` internal methods
     * when a sortable method is triggered
     */
    ReactSortable.prototype.callbacksWithOnEvent = function (evtName) {
        var _this = this;
        return function (evt) {
            // call the component prop
            _this.triggerOnElse(evt, evtName);
            // calls state change
            _this[evtName](evt);
        };
    };
    /**
     * Returns a function that triggers when a sortable method is triggered
     */
    ReactSortable.prototype.callbacks = function (evtName) {
        var _this = this;
        return function (evt) {
            // call the component prop
            _this.triggerOnElse(evt, evtName);
        };
    };
    return ReactSortable;
}(Component));

export { ReactSortable };
