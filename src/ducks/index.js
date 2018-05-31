import { combineReducers, createStore } from "redux";

import products from "./products";

const reducer = combineReducers({ products });

const createTendaOnlineStore = () => {
  return createStore(reducer);
};

export default createTendaOnlineStore;
