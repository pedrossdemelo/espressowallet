const initialState = {
  email: '',
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
  case 'user/login':
    return {
      ...state,
      email: action.payload,
    };
  default: return state;
  }
}
