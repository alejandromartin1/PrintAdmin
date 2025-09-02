// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import usuarioReducer from './reducers/usuarioReducer'; // ejemplo

export const store = configureStore({
  reducer: {
    usuario: usuarioReducer
  }
});
