import * as types from '../constants';

export default function reducer(state={ currentTheme: 0, profile : false }, actions) {
  switch (actions.type) {
    
    case types.SET_THEME:
      return {
        ...state,
        currentTheme: actions.payload 
      }
    
    case types.SET_PROFILE:
      return {
        ...state,
        profile: actions.payload
      }
    
    case types.SET_LOADER:
      return {
        ...state,
        loader: actions.payload
      }
    

    default:
      return state
  }
}
