// src/store/localStorageMiddleware.js
export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const { favorites } = store.getState();
  if (favorites) {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites.items));
    } catch (error) {
      console.error("Failed to save favorites to localStorage:", error);
    }
  }
  return result;
};
