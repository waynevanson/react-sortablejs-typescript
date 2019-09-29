# tsc-react-sortablejs

React component written in Typescript

## Features

- Typescript support!
- Drag and Drop between lists
- Nested lists
- Calculates items in list automatically
- Full API of SortableJS
- Convenient SortableJS API via `props`
- Controlled and Uncontrolled components
- Sortable Utilities
- Compatible with third part UI libraries
- SortableJS Plugin Support

If you find any features lacking, create an issue and/or pull request.

## Upgrading to Major Version `+2.0.0`

There are a number of API changes that are breaking. `react-sortablejs` was lacking many features ofit's sibling intergrations, such as in `vuedraggable`.

### `state`

The `state` prop takes the state you'd like to as a list. This is then changed inside `ReactSortable` to manage the state for you.

This is primarily used to return state for you in the new `onChange` prop.

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

- SortableJS as a type
- MultiDrag as a class (plugin)
- ReactSortable (use as default)

This changes returns

`onChange` is now `(list: any[], Sortable: SortableJS, evt: SortableEvent) => any` from `(order: string[], Sortable: SortableJS, evt: SortableEvent) => any`. There is no need for you to sort out your own lists anymore.

- Controlled Components only. To use without managing much state, use a `FunctionComponent` and utilize the `useState()` hook provided by React.
- `data-id` is not required for each list item anymore, as the component will do this for you when the `unique` key (not the index) is provided. There is a warning message for this.
- Add event listeners via `props`, such as `add={(evt) => console.log('I added an item from a different list to this list!)}`

## Caveats / Gotchas

### React is functional and **not** OOP

state works from the top down, so you have to affect the root state. if you want to use nested sorrtables, refer to the nested component

### Nesting

we've created a component

## Examples

### Controlled Component - Functional

```tsx
```

### Controlled Component - Class

```tsx
```

## Contributing

### How does it work?

In a nutshell, it transposes `props` into `Sortable` options and reverses any DOM changes that `Sortable` creates so react can handle them.
This way we have a great developer experience with all the great features of `Sortable` with the power of React.# react-sortablejs-typescript
