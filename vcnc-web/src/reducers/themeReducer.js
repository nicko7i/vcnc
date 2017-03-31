import initialState from './initialState';

const reducers = {
  // Intentionally empty.  The UI theme is not user-changeable.
  // This empty reducer provides consistent way to initialize the store and
  // also to propagate its values to components (via props in the usual way).
  // Standard Redux mechanisms ensure the theme configuration is not altered.
};

const leaveStateUnchanged = (state) => state;

export default (state = initialState.theme, action) => {
  if (state === null) return {};
  const reducer = reducers[action.type] || leaveStateUnchanged;
  return reducer(state, action);
};
