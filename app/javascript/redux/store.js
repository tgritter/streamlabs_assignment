import * as storage from 'redux-storage';
import rootReducer from './reducer';
import { createStore, applyMiddleware, combineReducers }from 'redux';
import createEngine from 'redux-storage-engine-localstorage';
import {updateStreamerName} from './action'
const reducer = storage.reducer(combineReducers(rootReducer));
const engine = createEngine('my-save-key');
const middleware = storage.createMiddleware(engine);
const createStoreWithMiddleware = applyMiddleware(middleware)(createStore);

const store = createStoreWithMiddleware(rootReducer);
const load = storage.createLoader(engine);
load(store)
  .then((newState) => dispatch(updateStreamerName(newState)))
  .catch(() => console.log('Failed to load previous state'));
export default store;