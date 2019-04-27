import { combineReducers } from "redux";
import user_reducer from "./users";
import channel_reducer from "./channels";

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer
});

export default rootReducer;
