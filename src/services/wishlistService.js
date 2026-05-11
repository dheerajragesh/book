import api from "../api/api";
import getAuthConfig from "./authConfig";

export const getWishlist = () => {
  return api.get("/api/wishlist/getwishlist", getAuthConfig());
};

export const removeFromWishlist = (productId) => {
  return api.delete(`/api/wishlist/removewishlist/${productId}`, getAuthConfig());
};

