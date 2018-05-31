import createTendaOnlineStore from "../../";
import { getView, getViewItemId, setView } from "../";

describe("views", () => {
  let store;
  beforeEach(() => {
    store = createTendaOnlineStore();
  });

  it("starts in the main view", () => {
    const view = getView(store.getState());

    expect(view).toBe("main");
  });

  it("changes the view with setView", () => {
    store.dispatch(setView("cart"));

    const view = getView(store.getState());
    expect(view).toBe("cart");
  });

  it("changes also the view of an item with setView", () => {
    store.dispatch(setView("detail", "123"));

    const view = getView(store.getState());
    const itemId = getViewItemId(store.getState());

    expect(view).toBe("detail");
    expect(itemId).toBe("123");
  });
});
