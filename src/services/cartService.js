import api from "../api/api";
import getAuthConfig from "./authConfig";

export const getCart = () => {
  return api.get("/api/cart/get", getAuthConfig());
};

export const updateCart = (bookId, quantity) => {
  return api.put(`/api/cart/update/${bookId}`, { quantity }, getAuthConfig());
};

export const removeFromCart = (bookId) => {
  return api.delete(`/api/cart/remove/${bookId}`, getAuthConfig());
};

