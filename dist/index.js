'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
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
/**
 * Uses
 * @param containerNode
 * @param nodeToInsert
 * @param atPosition a number that is not negative
 */
function insertNodeAt(containerNode, nodeToInsert, atPosition) {
    var refNode = atPosition === 0
        ? containerNode.children[0]
        : containerNode.children[atPosition - 1].nextSibling;
    containerNode.insertBefore(nodeToInsert, refNode);
}
//

var store = { dragging: null };
var ReactSortable = /** @class */ (function (_super) {
    __extends(ReactSortable, _super);
    function ReactSortable(props) {
        var _this = _super.call(this, props) || this;
        _this.ref = react.createRef();
        return _this;
    }
    Object.defineProperty(ReactSortable.prototype, "sortable", {
        /**
         * The sortable instance
         */
        get: function () {
            return this.ref.current;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactSortable.prototype, "sortableHTML", {
        /**
         * Removes Sortable from the type
         */
        get: function () {
            return this.ref.current;
        },
        enumerable: true,
        configurable: true
    });
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
        return react.createElement(tagCheck, __assign({ ref: this.ref }, classicProps), children);
    };
    /**
     * Calls the `props.onMove` function
     * @param moveEvt
     */
    ReactSortable.prototype.triggerOnMove = function (moveEvt) {
        var onMove = this.props.onMove;
        if (onMove)
            onMove(moveEvt);
    };
    /**
     * Calls the `props.on[add, start, ...etc] function
     * @param evt
     * @param evtName
     */
    ReactSortable.prototype.triggerOnElse = function (evt, evtName) {
        var propEvent = this.props[evtName];
        if (propEvent)
            propEvent(evt);
    };
    // Element is dropped into the list from another list
    ReactSortable.prototype.onAdd = function (evt) {
        // remove from this list,
        removeNode(evt.item);
        var _a = this.props, state = _a.state, setState = _a.setState;
        // add item to the `props.state`
        var newState = __spread(state);
        var newItem = store.dragging.props.state[evt.oldIndex];
        newState.splice(evt.newIndex, 0, newItem);
        setState(newState);
    };
    // Element is removed from the list into another list
    ReactSortable.prototype.onRemove = function (evt) {
        if (store.dragging === null || store.dragging.sortableHTML === null)
            return;
        var item = evt.item, oldIndex = evt.oldIndex;
        insertNodeAt(store.dragging.sortableHTML, item, oldIndex);
        var _a = this.props, state = _a.state, setState = _a.setState;
        // remove item in the `props.state`
        var newState = __spread(state);
        var _b = __read(newState.splice(evt.oldIndex, 1), 1), oldItem = _b[0];
        setState(newState);
    };
    // Changed sorting within list
    // basically the add and remove for actions in the same list
    ReactSortable.prototype.onUpdate = function (evt) {
        removeNode(evt.item);
        insertNodeAt(evt.from, evt.item, evt.oldIndex);
        var _a = this.props, state = _a.state, setState = _a.setState;
        // add item to the `props.state`
        var newState = __spread(state);
        var _b = __read(newState.splice(evt.oldIndex, 1), 1), oldItem = _b[0];
        newState.splice(evt.newIndex, 0, oldItem);
        setState(newState);
    };
    ReactSortable.prototype.onStart = function (evt) {
        store.dragging = this;
    };
    ReactSortable.prototype.onEnd = function (evt) {
        store.dragging = null;
    };
    /**
     * Append the props that are options into the options
     * @param options
     * @param groupOptions
     */
    ReactSortable.prototype.makeOptions = function () {
        var _this = this;
        var _a = this.props, state = _a.state, setState = _a.setState, children = _a.children, tag = _a.tag, style = _a.style, className = _a.className, options = __rest(_a, ["state", "setState", "children", "tag", "style", "className"]);
        var removers = ['onAdd', 'onUpdate', 'onRemove', 'onStart', 'onEnd'];
        var norms = [
            'onUnchoose',
            'onChoose',
            'onClone',
            'onFilter',
            'onSort'
        ];
        var newOptions = options;
        removers.forEach(function (name) { return (newOptions[name] = _this.callbacksWithOnEvent(name)); });
        norms.forEach(function (name) { return (newOptions[name] = _this.callbacks(name)); });
        return newOptions;
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
}(react.Component));

exports.ReactSortable = ReactSortable;
