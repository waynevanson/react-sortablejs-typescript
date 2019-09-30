import styled from 'styled-components'

export const makeState = () => [
  { id: '1', name: 'shrek', children: [] },
  { id: '2', name: 'fiona', children: [] },
  { id: '3', name: 'donkey', children: [] }
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
