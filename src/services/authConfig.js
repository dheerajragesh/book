const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default getAuthConfig;

