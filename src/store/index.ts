import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Lets plain `useSelector` calls across the app infer `state: RootState`
// automatically, matching react-redux v7's documented typing pattern.
declare module "react-redux" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DefaultRootState extends RootState {}
}

export default store;
