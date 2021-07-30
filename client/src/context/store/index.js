import { createContext, useContext } from 'react'

import { initialState } from "../../context"

export const StoreContext = createContext(initialState)

export function useStoreContext() {
  return useContext(StoreContext)
}

export * from './initialState'
