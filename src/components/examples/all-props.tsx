import React, { FC, useState, useRef } from 'react'
import { Item } from '../__exclude__/react-sortable-nested'
import { makeState } from './functions-and-styles'
import { ReactSortable } from '../react-sortable'
import { MultiDrag } from 'sortablejs'

export const BasicAllProps: FC = props => {
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
      onChange={() => console.log('onChange')}
      onClone={() => console.log('onClone')}
      onChoose={() => console.log('onChoose')}
      onEnd={() => console.log('onEnd')}
      onFilter={() => console.log('onFilter')}
      onMove={() => {
        console.log('onMove')
        return false
      }}
      onRemove={() => console.log('onRemove')}
      onSort={() => console.log('onSort')}
      onSpill={() => console.log('onSpill')}
      onStart={() => console.log('onStart')}
      onUnchoose={() => console.log('onUnchoose')}
      onUpdate={() => console.log('onUpdate')}
    >
      {state.map(item => (
        <div className="chosen draggable handle" key={item.id}>
          {item.name}
        </div>
      ))}
    </ReactSortable>
  )
}
