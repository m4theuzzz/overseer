export const userLogin = async (userData) => {
  const settings = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData),
  };

  const res = await fetch('http://localhost:3000/auth/login', settings);

  return res;
};
