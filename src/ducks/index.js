import { combineReducers, createStore } from "redux";

import products from "./products";
import views from "./views";
import cart from "./cart";
import freezeReducer from "./freezeReducer";

const reducer = combineReducers({ products, views, cart });

const compositeReducer = (state, action) =>
  freezeReducer(reducer(state, action));

const createTendaOnlineStore = () => {
  return createStore(compositeReducer);
};

export default createTendaOnlineStore;
