const initialState = {
    user: null,
    isLoading: false
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_USER_START':
        return { ...state, isLoading: true };
      case 'FETCH_USER_SUCCESS':
        return { ...state, user: action.payload, isLoading: false };
      default:
        return state;
    }
  };
  
  export default userReducer;