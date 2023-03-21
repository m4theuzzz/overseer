export async function useServices(module, method, id, data, fatherId, reportsParam) {
  try {
    const apiToken = window.apiToken;

    const urls = {
      login: "/auth/login/",
      refresh: "/auth/refresh/",
      users: "/users/",
      clients: "/clients/",
      constructions: "/constructions/",
      services: "/services/",
      budgets: "/budgets/",
      transactions: "/transactions/",
      budgetServices: `/budgets/${fatherId}/services/`,
      budgetsTransactions: `/budgets/${fatherId}/transactions/`,
      reports: `/reports/${reportsParam}/`,
      mailer: `/mailer/sendEmail/`,
      exportBudget: `/exports/budget/`
    };

    const settings = {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "session-token": apiToken,
      },
    };

    if (data) {
      settings.body = JSON.stringify(data);
    }

    const urlReq = id ? (urls[module] + id) : urls[module];

    const res = await fetch(window.apiHost + urlReq, settings);
    let resData;

    if (method === 'GET' && res) {
      resData = await res.json()
    }

    return resData ? resData : res
  } catch (error) {
    console.log(error);
  }
}
