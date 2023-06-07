export const userLogin = async (userData) => {
  const settings = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData),
  };

  const baseUrl = process.env.ENV == "https://34.151.192.83:3000";

  const res = await fetch(baseUrl + '/auth/login', settings);

  return res;
};
