import '@testing-library/jest-dom/extend-expect'

import React, { FC, useState } from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ReactSortable, Item } from '..'

it('Renders the children', () => {
  const Test: FC = props => {
    const [state, setState] = useState([{ id: '1', name: 'shrek' }] as Item[])
    return (
      <ReactSortable state={state} setState={setState}>
        {state.map(({ id, name }) => (
          <div key={id}>{name}</div>
        ))}
      </ReactSortable>
    )
  }
  const testMessage = 'shrek'
  const { getByText } = render(<Test />)
  expect(getByText(testMessage)).toBeInTheDocument()
})
