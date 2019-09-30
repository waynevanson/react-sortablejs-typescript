'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Sortable = _interopDefault(require('sortablejs'));

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

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
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
    list = props.list, setList = props.setList, children = props.children, tag = props.tag, style = props.style, className = props.className, uncontrolled = props.uncontrolled, 
    // sortable options that have methods we want to overwrite
    onAdd = props.onAdd, onChange = props.onChange, onChoose = props.onChoose, onClone = props.onClone, onEnd = props.onEnd, onFilter = props.onFilter, onRemove = props.onRemove, onSort = props.onSort, onStart = props.onStart, onUnchoose = props.onUnchoose, onUpdate = props.onUpdate, onMove = props.onMove, options = __rest(props, ["list", "setList", "children", "tag", "style", "className", "uncontrolled", "onAdd", "onChange", "onChoose", "onClone", "onEnd", "onFilter", "onRemove", "onSort", "onStart", "onUnchoose", "onUpdate", "onMove"]);
    return options;
}

var store = { dragging: null };
/**
 * A component for making the first layer of children sortable,
 * using `SortableJS` to manipulate the DOM.
 */
var ReactSortable = /** @class */ (function (_super) {
    __extends(ReactSortable, _super);
    function ReactSortable(props) {
        var _this = _super.call(this, props) || this;
        _this.childState = null;
        _this.ref = React.createRef();
        return _this;
    }
    ReactSortable.prototype.componentDidMount = function () {
        if (this.ref.current === null)
            return;
        var newOptions = this.makeOptions();
        Sortable.create(this.ref.current, newOptions);
    };
    ReactSortable.prototype.render = function () {
        var _a = this.props, tag = _a.tag, children = _a.children, style = _a.style, className = _a.className;
        var classicProps = { style: style, className: className };
        var tagCheck = !tag || tag === null ? 'div' : tag;
        // todo: add data-id to children
        return React.createElement(tagCheck, __assign({ ref: this.ref }, classicProps), children);
    };
    /**
     * Calls the `props.on[add | start | ...etc]` function
     * @param evt
     * @param evtName
     */
    ReactSortable.prototype.triggerOnElse = function (evt, evtName) {
        var propEvent = this.props[evtName];
        if (propEvent)
            propEvent(evt, store);
    };
    // Element is dropped into the list from another list
    ReactSortable.prototype.onAdd = function (evt) {
        var _a = this.props, setList = _a.setList, uncontrolled = _a.uncontrolled;
        // remove from this list,
        removeNode(evt.item);
        if (uncontrolled || !setList)
            return;
        // add item to the `props.state`
        setList(function (prevState) {
            var newState = __spread(prevState);
            var newItem = store.dragging.props.list[evt.oldIndex];
            newState.splice(evt.newIndex, 0, newItem);
            return newState;
        });
    };
    // Element is removed from the list into another list
    ReactSortable.prototype.onRemove = function (evt) {
        var item = evt.item, from = evt.from, oldIndex = evt.oldIndex;
        insertNodeAt(from, item, oldIndex);
        var _a = this.props, setList = _a.setList, uncontrolled = _a.uncontrolled;
        if (uncontrolled || !setList)
            return;
        // remove item in the `props.state`fromComponent
        setList(function (prevState) {
            var newState = __spread(prevState);
            newState.splice(oldIndex, 1);
            return newState;
        });
    };
    // Changed sorting within list
    // basically the add and remove for actions in the same list
    ReactSortable.prototype.onUpdate = function (evt) {
        removeNode(evt.item);
        insertNodeAt(evt.from, evt.item, evt.oldIndex);
        var _a = this.props, setList = _a.setList, uncontrolled = _a.uncontrolled;
        if (uncontrolled || !setList)
            return;
        // remove and add items to the `props.state`
        setList(function (prevList) {
            var newState = __spread(prevList);
            var _a = __read(newState.splice(evt.oldIndex, 1), 1), oldItem = _a[0];
            newState.splice(evt.newIndex, 0, oldItem);
            return newState;
        });
    };
    ReactSortable.prototype.onStart = function (evt) {
        store.dragging = this;
    };
    ReactSortable.prototype.onEnd = function (evt) {
        store.dragging = null;
    };
    /**
     * Append the props that are options into the options
     */
    ReactSortable.prototype.makeOptions = function () {
        var _this = this;
        var removers = [
            'onAdd',
            'onUpdate',
            'onRemove',
            'onStart',
            'onEnd'
        ];
        var norms = [
            'onUnchoose',
            'onChoose',
            'onClone',
            'onFilter',
            'onSort',
            'onChange'
        ];
        var options = destructurePropsForOptions(this.props);
        var newOptions = options;
        removers.forEach(function (name) { return (newOptions[name] = _this.callbacksWithOnEvent(name)); });
        norms.forEach(function (name) { return (newOptions[name] = _this.callbacks(name)); });
        // todo: add `onMove`. Types are cooked on this one not sure why...
        return __assign({}, newOptions);
    };
    /**
     * Returns a function that
     * triggers one of the internal methods
     * when a sortable method is triggered
     */
    ReactSortable.prototype.callbacksWithOnEvent = function (evtName) {
        var _this = this;
        return function (evt) {
            // calls state change
            _this[evtName](evt);
            // call the component prop
            _this.triggerOnElse(evt, evtName);
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
}(React.Component));
// type NewMoveOptions

function useHandlers(props, sorting) {
    var handleAddToState = sorting.handleAddToState, handleRemoveFromState = sorting.handleRemoveFromState, handleUpdateTheState = sorting.handleUpdateTheState;
    var onAdd = function (evt, store) {
        handleAddToState(evt, store);
        if (props.onAdd)
            props.onAdd(evt, store);
    };
    var onRemove = function (evt, store) {
        handleRemoveFromState(evt);
        if (props.onRemove)
            props.onRemove(evt, store);
    };
    var onUpdate = function (evt, store) {
        handleUpdateTheState(evt, store);
        if (props.onUpdate)
            props.onUpdate(evt, store);
    };
    return { onAdd: onAdd, onRemove: onRemove, onUpdate: onUpdate };
}
function useSorting(props, depth) {
    var setRootState = props.setRootState;
    var constants = { depth: depth, currentDepth: 0 };
    function handleAddToState(evt, store) {
        if (store.dragging === null)
            return console.error('bad vlaue in this');
        console.log('add');
        setRootState(function (prevState) {
            var newItem = store.dragging.props.list[evt.oldIndex];
            var newState = addToState(__assign(__assign({}, constants), { state: prevState, refItem: newItem, index: evt.newIndex }));
            console.log({ prevState: prevState, newState: newState });
            return newState;
        });
    }
    function handleRemoveFromState(evt) {
        console.log('remove');
        setRootState(function (prevState) {
            var newState = removeFromState(__assign(__assign({}, constants), { state: prevState, index: evt.oldIndex }));
            console.log({ prevState: prevState, newState: newState });
            return newState;
        });
    }
    function handleUpdateTheState(evt, store) {
        console.log('update');
        console.log({ setRootState: setRootState });
        setRootState(function (prevState) {
            var newItem = store.dragging.props.list[evt.oldIndex];
            var postRemove = removeFromState(__assign(__assign({}, constants), { state: prevState, index: evt.oldIndex }));
            var postAdd = addToState(__assign(__assign({}, constants), { refItem: newItem, state: postRemove, index: evt.newIndex }));
            console.log({ prevState: prevState, newState: postAdd });
            return postAdd;
        });
    }
    return { handleAddToState: handleAddToState, handleRemoveFromState: handleRemoveFromState, handleUpdateTheState: handleUpdateTheState };
}
function addToState(params) {
    var e_1, _a;
    var state = params.state, refItem = params.refItem, index = params.index, depth = params.depth, currentDepth = params.currentDepth;
    var newState = [];
    var currentIndex = 0;
    if (!state)
        return newState;
    try {
        for (var state_1 = __values(state), state_1_1 = state_1.next(); !state_1_1.done; state_1_1 = state_1.next()) {
            var item = state_1_1.value;
            var placeholder = item.children, itemNoKids = __rest(item, ["children"]);
            var children = item.children
                ? addToState(__assign(__assign({}, params), { state: item.children, currentDepth: currentDepth + 1 }))
                : [];
            //@ts-ignore
            var newItem = children.length > 0 ? __assign(__assign({}, itemNoKids), { children: children }) : __assign({}, itemNoKids);
            if (currentDepth === depth && index === currentIndex)
                newState.push(refItem, newItem);
            else
                newState.push(newItem);
            currentIndex++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (state_1_1 && !state_1_1.done && (_a = state_1.return)) _a.call(state_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return newState;
}
function removeFromState(params) {
    var e_2, _a;
    var state = params.state, index = params.index, depth = params.depth, currentDepth = params.currentDepth;
    var newState = [];
    var currentIndex = 0;
    if (!state)
        return newState;
    try {
        for (var _b = __values(__spread(state)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var item = _c.value;
            var placeholder = item.children, itemNoKids = __rest(item, ["children"]);
            var children = item.children
                ? removeFromState(__assign(__assign({}, params), { state: item.children, currentDepth: currentDepth + 1 }))
                : [];
            //@ts-ignore
            var newItem = children.length > 0 ? __assign(__assign({}, itemNoKids), { children: children }) : __assign({}, itemNoKids);
            var matches = currentDepth === depth && index === currentIndex;
            if (!matches)
                newState.push(newItem);
            currentIndex++;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return newState;
}

/**
 * State is managed for you, so relax!
 *
 * @param props
 */
function SortableRecursive(props) {
    var children = props.children, list = props.list, propDepth = props.depth, setRootState = props.setRootState, options = __rest(props, ["children", "list", "depth", "setRootState"]);
    var depth = propDepth || 0;
    var sorting = useSorting(props, depth);
    var handlers = useHandlers(props, sorting);
    return (React__default.createElement(ReactSortable, __assign({ uncontrolled: true }, options, handlers, { list: list }), list.map(function (item) {
        // todo:
        // allow a ref?
        // parse details like `depth` and `index` and `path` to the `children` function
        var Nested = function () { return (React__default.createElement(SortableRecursive, __assign({}, props, { children: children, depth: depth + 1, 
            //@ts-ignore
            list: item.children || [] }))); };
        return React.cloneElement(children(item, Nested), { key: item.id });
    })));
}

function ReactSortableNested(props) {
    var list = props.list, setList = props.setList, otherProps = __rest(props, ["list", "setList"]);
    return React__default.createElement(SortableRecursive, __assign({ setRootState: setList, list: list, depth: 0 }, otherProps));
}

exports.ReactSortable = ReactSortable;
exports.ReactSortableNested = ReactSortableNested;
