import createTendaOnlineStore from "../../";
import { getProduct, listProducts, setProduct } from "../";

describe("products", () => {
  let store;
  beforeEach(() => {
    store = createTendaOnlineStore();
  });

  it("starts with an empty list of products", () => {
    const productsList = listProducts(store.getState());

    expect(productsList).toEqual([]);
  });

  const banana = {
    id: "banana",
    price: 2.0,
    image:
      "http://images6.fanpop.com/image/photos/34500000/Banana-3-bananas-34512789-1000-1000.jpg"
  };

  it("lists setted products", () => {
    store.dispatch(setProduct(banana));

    const productsList = listProducts(store.getState());
    expect(productsList).toContain(banana);
  });

  it("returns the same list of products instance if nothing has changed", () => {
    const productsList1 = listProducts(store.getState());
    const productsList2 = listProducts(store.getState());

    expect(productsList1).toBe(productsList2);
  });

  it("gives setted products by productId", () => {
    store.dispatch(setProduct(banana));

    const product = getProduct(store.getState(), { productId: banana.id });

    expect(product).toBe(banana);
  });

  it("gives undefined if the requeste product is not given", () => {
    const product = getProduct(store.getState(), { productId: banana.id });

    expect(product).toBeUndefined();
  });
});
