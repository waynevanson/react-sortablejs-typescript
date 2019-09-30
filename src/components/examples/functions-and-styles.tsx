import styled from 'styled-components'

export const makeState = () => [
  { id: '1', name: 'shrek' },
  { id: '2', name: 'fiona' },
  { id: '3', name: 'donkey' }
]

export const List = styled.div`
  text-align: left;
`

export const NodeLike = styled.div`
  padding: 0.4rem;
  border: 1px solid #aaa;
  border-radius: 0.5rem;
  margin: 5px 0 0 0;
`
