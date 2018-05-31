import { createSelector } from "reselect";

const getProducts = state => state.products;

const listProducts = createSelector(getProducts, products =>
  Object.values(products)
);

export default listProducts;
