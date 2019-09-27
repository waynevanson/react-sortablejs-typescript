import React, { FC, Component, ReactElement, ReactComponentElement } from 'react'
import * as Comps from './components'
import styled from 'styled-components'
import './App.css'

/**
 * This holds the page with our examples
 */
const App: React.FC = () => {
  return (
    <Wrap>
      <Shrek>
        {Object.entries(Comps).map(([name, Component], index) => (
          <Example key={index} component={Component} title={name} number={index} />
        ))}
      </Shrek>
    </Wrap>
  )
}

interface ExampleProps {
  component: any
  title: string
  number: number
}

const Example: FC<ExampleProps> = props => {
  const { component: Component, title, number } = props
  return (
    <Container>
      <p>
        Component: <code>{title}</code>
      </p>
      <Component />
    </Container>
  )
}

export default App

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`

const Shrek = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 960px;
`

const Container = styled.div`
  border: 0.1em solid black;
  border-radius: 1rem;
  justify-content: center;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: .5rem 1rem;
  padding: 1rem;
`
