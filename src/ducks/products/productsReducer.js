import { SET_PRODUCT } from ".";

const productsReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_PRODUCT: {
      const { product } = action;
      return {
        ...state,
        [product.id]: product
      };
    }
    default:
      return state;
  }
};

export default productsReducer;
