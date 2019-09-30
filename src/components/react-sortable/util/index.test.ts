import { destructurePropsForOptions } from '.'
import { Component } from 'react'
import { ReactSortableProps } from '..'

describe(destructurePropsForOptions, () => {
  it.skip('should return options as described', () => {
    const options: Component<ReactSortableProps<any>, {}, any>['props'] = {
      animation: 200
    }
  })
})
