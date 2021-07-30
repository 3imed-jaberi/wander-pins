import { useReducer } from "react"

import { StoreContext, initialState, reducer } from "../../context"

export function StoreContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}
