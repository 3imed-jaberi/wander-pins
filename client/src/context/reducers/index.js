import {
  LOGIN_USER,
  IS_LOGGED_IN,
  SIGNOUT_USER,
  CREATE_DRAFT,
  UPDATE_DRAFT_LOCATION,
  DELETE_DRAFT,
  GET_PINS,
  CREATE_PIN,
  SET_PIN,
  DELETE_PIN,
  CREATE_COMMENT
} from '../types'

export function reducer(state, { type: ActionType, payload: ActionPayload }) {
  switch (ActionType) {
    case LOGIN_USER:
      return {
        ...state,
        currentUser: ActionPayload
      }
    case IS_LOGGED_IN:
      return {
        ...state,
        isAuth: ActionPayload
      }
    case SIGNOUT_USER:
      return {
        ...state,
        isAuth: false,
        currentUser: null
      }
    case CREATE_DRAFT:
      return {
        ...state,
        currentPin: null,
        draft: {
          latitude: 0,
          longitude: 0
        }
      }
    case UPDATE_DRAFT_LOCATION:
      return {
        ...state,
        draft: ActionPayload
      }
    case DELETE_DRAFT:
      return {
        ...state,
        draft: null
      }
    case GET_PINS:
      return {
        ...state,
        pins: ActionPayload
      }
    case CREATE_PIN:
      const newPin = ActionPayload
      const prevPin = state.pins.filter(pin => pin._id !== newPin._id)
      return {
        ...state,
        pins: [
          ...prevPin,
          newPin
        ]
      }
    case SET_PIN:
      return {
        ...state,
        currentPin: ActionPayload,
        draft: null
      }
    case DELETE_PIN:
      const deletedPin = ActionPayload
      const filterdPins = state.pins.filter(pin => pin._id !== deletedPin._id)
      return {
        ...state,
        pins: filterdPins,
        currentPin: null
      }
    case CREATE_COMMENT:
      const updatedCurrentPin = ActionPayload
      const updatedPins = state.pins.map(pin => pin._id === updatedCurrentPin._id ? updatedCurrentPin : pin)
      return {
        ...state,
        pins: updatedPins,
        currentPin: updatedCurrentPin
      }
    default:
      return state
  }
}
