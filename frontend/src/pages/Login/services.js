export const userLogin = async (userData) => {
  const settings = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData),
  };

  const baseUrl = process.env.ENV == 'prod' ? "https://overseer-2oe4yrtbla-rj.a.run.app:3000" : "http://localhost:3000";

  const res = await fetch(baseUrl + '/auth/login', settings);

  return res;
};
