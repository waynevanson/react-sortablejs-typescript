import React, { FC, useState, useRef } from 'react'
import { Item } from '../__exclude__/react-sortable-nested'
import { makeState } from './functions-and-styles'
import { ReactSortable } from '../react-sortable'
import { MultiDrag } from 'sortablejs'

export const Basic: FC = props => {
  const [state, setState] = useState<Item[]>(makeState)
  const ref = useRef(null)
  return (
    <ReactSortable
      // react-sortable specific props
      list={state}
      setList={setState}
      // sortable-option props
      animation={200}
      bubbleScroll={true}
      chosenClass="chosen"
      // do me
      dataIdAttr="sortable-id"
      delay={300}
      delayOnTouchOnly={true}
      direction="horizontal"
      disabled={false}
      draggable=".draggable"
      dragClass="drag"
      dragoverBubble={false}
      dropBubble
      easing="linear"
      emptyInsertThreshold={17}
      fallbackClass="fallback"
      fallbackOffset={{ x: 20, y: 30 }}
      fallbackOnBody={true}
      fallbackTolerance={25}
      filter={(event, target, sortable) => false}
      forceFallback={false}
      ghostClass="ghost"
      group={{
        name: 'name',
        pull: true,
        put: true,
        revertClone: false
      }}
      handle=".handle"
      ignore=".ignore"
      invertSwap={false}
      invertedSwapThreshold={25}
      plugins={new MultiDrag()}
      preventOnFilter={false}
      ref={ref}
      removeCloneOnHide={false}
      removeOnSpill={false}
      revertOnSpill={true}
      scroll={true}

      // sortable-option methods
      onAdd={() => console.log('onAdd')}
      onChange={() => console.log('onAdd')}
      onClone={() => console.log('onAdd')}
      onChoose={() => console.log('onAdd')}
      onEnd={() => console.log('onAdd')}
      onFilter={() => console.log('onAdd')}
      onMove={() => {
        console.log('onAdd')
        return true
      }}
      onRemove={() => console.log('onAdd')}
      onSort={() => console.log('onAdd')}
      onSpill={() => console.log('onAdd')}
      onStart={() => console.log('onAdd')}
      onUnchoose={() => console.log('onAdd')}
      onUpdate={() => console.log('onAdd')}
    >
      {state.map(item => (
        <div className="chosen draggable handle" key={item.id}>
          {item.name}
        </div>
      ))}
    </ReactSortable>
  )
}
