import { LOAD } from 'redux-storage';

const initialState = {
    streamer_name: 'test'
};

  const rootReducer = (state = initialState, action) => {
      if (action.type === 'UPDATE_STREAMER_NAME') {
        return {
            ...state,
            streamer_name: action.payload
        }      
      }
      else if (action.type === "REDUX_STORAGE_LOAD") {
        return {
            ...state,
            streamer_name: action.payload.streamer_name
        } 
      }
    return state;
  };
  export default rootReducer;