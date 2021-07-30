import { useReducer } from 'react'

import { initialState, reducer } from '../context'

function useDispatch() {
  return useReducer(reducer, initialState)[1]
}

export default useDispatch
