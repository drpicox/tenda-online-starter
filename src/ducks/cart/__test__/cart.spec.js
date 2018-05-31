import createTendaOnlineStore from "../../";
import {
  listLineItems,
  getLineItem,
  getLineItems,
  getTotalItems,
  getTotalPrice,
  incrementQuantity,
  decrementQuantity,
  dropLineItem
} from "../";
import { setProduct } from "../../products";

describe("cart", () => {
  const banana = {
    id: "banana",
    price: 2.0,
    image:
      "http://images6.fanpop.com/image/photos/34500000/Banana-3-bananas-34512789-1000-1000.jpg"
  };

  const pear = {
    id: "pear",
    price: 3.0,
    image:
      "https://static.independent.co.uk/s3fs-public/thumbnails/image/2014/11/06/17/pears3.jpg"
  };

  const tangerine = {
    id: "tangerine",
    price: 3.0,
    image:
      "http://wax-oil-flavoring.com/wp-content/uploads/2016/06/Tangerine.jpg"
  };

  let store;
  beforeEach(() => {
    store = createTendaOnlineStore();
    store.dispatch(setProduct(banana));
    store.dispatch(setProduct(pear));
    store.dispatch(setProduct(tangerine));
  });

  it("starts with an empty list of line items", () => {
    const lineItems = listLineItems(store.getState());

    expect(lineItems).toEqual([]);
  });

  it("increment adds new line items", () => {
    store.dispatch(incrementQuantity(banana.id));

    const lineItem = getLineItem(store.getState(), { productId: banana.id });
    expect(lineItem).toMatchObject({
      id: banana.id,
      quantity: 1
    });
  });

  it("gives many information about the line item", () => {
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(banana.id));

    const lineItem = getLineItem(store.getState(), { productId: banana.id });
    expect(lineItem).toMatchObject({
      ...banana,
      quantity: 2,
      accumulatedPrice: 4.0
    });
  });

  it("gives the same information in the line items list", () => {
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(pear.id));

    const lineItems = listLineItems(store.getState());

    const lineItemBanana = getLineItem(store.getState(), {
      productId: banana.id
    });
    const lineItemPear = getLineItem(store.getState(), { productId: pear.id });
    expect(lineItems).toEqual([lineItemBanana, lineItemPear]);
  });

  it("decrements quantities via decrementQuantity", () => {
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(decrementQuantity(banana.id));

    const lineItem = getLineItem(store.getState(), { productId: banana.id });
    expect(lineItem).toMatchObject({ quantity: 1 });
  });

  it("never decrements below 1 with decrementQuantity", () => {
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(decrementQuantity(banana.id));

    const lineItem = getLineItem(store.getState(), { productId: banana.id });
    expect(lineItem).toMatchObject({ quantity: 1 });
  });

  it("gives undefined when asking for non present product", () => {
    const lineItem = getLineItem(store.getState(), { productId: "unknown" });

    expect(lineItem).toBeUndefined();
  });

  it("removes line items with dropLineItem", () => {
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(dropLineItem(banana.id));

    const lineItems = listLineItems(store.getState());
    expect(lineItems).toEqual([]);
  });

  it("lists keeps the order in which products have been added", () => {
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(pear.id));
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(tangerine.id));
    store.dispatch(dropLineItem(pear.id));
    store.dispatch(incrementQuantity(pear.id));

    const lineItems = listLineItems(store.getState());
    expect(lineItems).toMatchObject([banana, tangerine, pear]);
  });

  it("returns the same line items instance if nothing has changed", () => {
    store.dispatch(incrementQuantity(banana.id));

    const lineItem1 = getLineItem(store.getState(), { productId: banana.id });
    const lineItem2 = getLineItem(store.getState(), { productId: banana.id });

    expect(lineItem1).toBe(lineItem2);
  });

  it("returns the same list of line items instance if nothing has changed", () => {
    store.dispatch(incrementQuantity(banana.id));

    const lineItems1 = listLineItems(store.getState());
    const lineItems2 = listLineItems(store.getState());

    expect(lineItems1).toBe(lineItems2);
  });

  it("gives the total amount of items", () => {
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(pear.id));

    const itemCount = getTotalItems(store.getState());

    expect(itemCount).toBe(3);
  });

  it("gives the total cart price", () => {
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(pear.id));

    const cartPrice = getTotalPrice(store.getState());

    expect(cartPrice).toBe(banana.price * 2 + pear.price);
  });

  it("updates total price if product price changes", () => {
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(banana.id));
    store.dispatch(incrementQuantity(pear.id));
    const oldPrice = getTotalPrice(store.getState());

    const newBanana = {
      ...banana,
      price: banana.price + 1
    };
    store.dispatch(setProduct(newBanana));

    const cartPrice = getTotalPrice(store.getState());

    expect(oldPrice).toBe(banana.price * 2 + pear.price);
    expect(cartPrice).toBe(newBanana.price * 2 + pear.price);
  });
});
