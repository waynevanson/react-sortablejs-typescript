# tsc-react-sortablejs
React component written in Typescript

## Features
+ Typescript support!
+ Drag and Drop between lists
+ Nested lists
+ Calculates items in list automatically
+ Full API of SortableJS
+ Convenient SortableJS API via `props`
+ Controlled and Uncontrolled components
+ Sortable Utilities
+ Compatible with third part UI libraries
+ SortableJS Plugin Support

If you find any features lacking, create an issue and/or pull request.


## Upgrading to Major Version `+2.0.0` 

There are a number of API changes that are breaking. `react-sortablejs` was lacking many features ofit's sibling intergrations, such as in `vuedraggable`.

### `list`

The `list` prop takes the state you'd like to as a list. This is then changed inside `ReactSortable` to manage the state for you.

This is primarily used to return state for you in the new `onChange` prop.

### `onChange`
``` tsx
// OLD API
<ReactSortable onChange={(order: string[], Sortable: SortableJS, evt: SortableEvent) => sortAndHandleOnChange(order)>
</ReactSortable>

// NEW API
<ReactSortable onChange={(list: any[], Sortable: SortableJS, evt: SortableEvent) => handleOnChange(list)}>
</ReactSortable>
```
### options

One of the largest changes is the API for the option, group and listening to sortable events.

#### option

#### group

#### Event Listeners from Sortable

##### start

##### end

##### choose

##### unchoose

#####

## Import

The following types are available for import via `ReactSortable`:
+ SortableJS as a type
+ MultiDrag as a class (plugin)
+ ReactSortable (use as default)




This changes returns 

`onChange` is now `(list: any[], Sortable: SortableJS, evt: SortableEvent) => any` from `(order: string[], Sortable: SortableJS, evt: SortableEvent) => any`. There is no need for you to sort out your own lists anymore.
+ Controlled Components only. To use without managing  much state, use a `FunctionComponent` and utilize the `useState()` hook provided by React.
+ `data-id` is not required for each list item anymore, as the component will do this for you when the `unique` key (not the index) is provided. There is a warning message for this.
+ Add event listeners via `props`, such as `add={(evt) => console.log('I added an item from a different list to this list!)} `


## Caveats / Gotchas
+ Add a list and use the `onChange` prop to update your state
+ The default import should be `ReactSortable` by convention. Using `Sortable` will create a *sortable instance* and not be controlled by React.

## Examples

### Controlled Component - Functional
``` tsx

```

### Controlled Component - Class
``` tsx

```

## Motivation
The motivation behind this project is to create a version of React SortableJs that infers types, for safety, intellisense and many other features that intergrate with the Typescript ecosystem.

It turns out that having type safety allowed for many of the features that were lacking in the +1.0.0 version to start working again, such as nested dragging.

The current officially suppported ES2015+ component does not support Typescript.

## Contributing

### How does it work?

In a nutshell, it transposes `props` into `Sortable` options and reverses any DOM changes that `Sortable` creates so react can handle them.
This way we have a great developer experience with all the great features of `Sortable` with the power of React.# react-sortablejs-typescript
