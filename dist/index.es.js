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

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var store = { dragging: null };
var ReactSortable = /** @class */ (function (_super) {
    __extends(ReactSortable, _super);
    function ReactSortable(props) {
        var _this = _super.call(this, props) || this;
        _this.ref = createRef();
        return _this;
    }
    Object.defineProperty(ReactSortable.prototype, "sortable", {
        get: function () {
            return this.ref.current;
        },
        enumerable: true,
        configurable: true
    });
    ReactSortable.prototype.componentDidMount = function () {
        if (this.ref.current === null)
            return;
        var _a = this.props, options = _a.options, groupOptions = _a.groupOptions;
        var newOptions = this.makeOptions(options, groupOptions);
        Sortable.create(this.ref.current, newOptions);
    };
    ReactSortable.prototype.render = function () {
        var _a = this.props, tag = _a.tag, children = _a.children;
        var tagCheck = !tag || tag === null ? 'div' : tag;
        return createElement(tagCheck, { ref: this.ref }, children);
    };
    ReactSortable.prototype.triggerOnMove = function (moveEvt) {
        var onMove = this.props.onMove;
        if (onMove)
            onMove(moveEvt);
    };
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
        var newState = __spreadArrays(state);
        var newItem = store.dragging.props.state[evt.oldIndex];
        newState.splice(evt.newIndex, 0, newItem);
        setState(newState);
    };
    // Element is removed from the list into another list
    ReactSortable.prototype.onRemove = function (evt) {
        // this had stuff in vue that is not handled here currently
        if (store.dragging === null || store.dragging.sortable === null)
            return;
        var item = evt.item, oldIndex = evt.oldIndex;
        insertNodeAt(store.dragging.sortable, item, oldIndex);
        var _a = this.props, state = _a.state, setState = _a.setState;
        // add item to the `props.state`
        var newState = __spreadArrays(state);
        var oldItem = newState.splice(evt.oldIndex, 1)[0];
        setState(newState);
    };
    // Changed sorting within list
    // basically the add and remove for actions in the same list
    ReactSortable.prototype.onUpdate = function (evt) {
        removeNode(evt.item);
        insertNodeAt(evt.from, evt.item, evt.oldIndex);
        var _a = this.props, state = _a.state, setState = _a.setState;
        // add item to the `props.state`
        var newState = __spreadArrays(state);
        var oldItem = newState.splice(evt.oldIndex, 1)[0];
        newState.splice(evt.newIndex, 0, oldItem);
        setState(newState);
    };
    ReactSortable.prototype.onStart = function (evt) {
        store.dragging = this;
    };
    ReactSortable.prototype.onEnd = function (evt) {
        store.dragging = null;
    };
    ReactSortable.prototype.makeOptions = function (options, groupOptions) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var group = groupOptions && { group: groupOptions };
        var removers = ['onAdd', 'onUpdate', 'onRemove', 'onStart', 'onEnd'];
        var norms = [
            'onUnchoose',
            'onChoose',
            'onClone',
            'onFilter',
            'onSort'
        ];
        var newOptions = {};
        removers.forEach(function (name) { return (newOptions[name] = _this.deliverCallbacks(name)); });
        norms.forEach(function (name) { return (newOptions[name] = _this.justEmit(name)); });
        return __assign(__assign(__assign({}, options), newOptions), group);
    };
    /**
     * Returns a function that triggers **a DOM change** when a sortable method is triggered
     */
    ReactSortable.prototype.deliverCallbacks = function (evtName) {
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
    ReactSortable.prototype.justEmit = function (evtName) {
        var _this = this;
        return function (evt) {
            // call the component prop
            _this.triggerOnElse(evt, evtName);
        };
    };
    return ReactSortable;
}(Component));
//
// THESE ARE THE ONLY 3 THAT DO
// DOM CHANGING OPERATIONS
//
// append the functions that change the dom
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

export { ReactSortable };
