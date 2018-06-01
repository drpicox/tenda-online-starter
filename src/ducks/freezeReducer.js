const freezeds = new WeakSet();

const freezeReducer = state => {
  if (typeof state === "object" && !freezeds.has(state)) {
    freezeds.add(state);
    Object.keys(state).forEach(k => {
      const val = state[k];
      if (typeof val === "object") {
        state[k] = freezeReducer(val);
      }
    });
  }
  Object.freeze(state);
  return state;
};

export default freezeReducer;
