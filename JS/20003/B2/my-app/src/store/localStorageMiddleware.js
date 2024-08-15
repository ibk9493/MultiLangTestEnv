// src/store/localStorageMiddleware.js
export const localStorageMiddleware = store => next => action => {
    const result = next(action);
    if (action.type?.startsWith('favorites/')) {
      const { favorites } = store.getState();
      localStorage.setItem('favorites', JSON.stringify(favorites.items));
    }
    return result;
  };