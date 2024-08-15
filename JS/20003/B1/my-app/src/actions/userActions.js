// actions/userActions.js
export const fetchUser = () => {
    return async (dispatch) => {
      dispatch({ type: 'FETCH_USER_START' });
      try {
        const response = await fetch('/api/user');
        const user = await response.json();
        dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });
      } catch (error) {
        // Handle error
      }
    };
  };