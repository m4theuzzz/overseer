import { AppRoutes } from "./routes";
import { GlobalStyles } from "./styles/global";
import toast, { Toaster } from "react-hot-toast";
import { useServices } from "./hooks/useServices";

const navigate = (path) => {
  const urlFragments = window.location.href.split('/');
  const baseURL = `${urlFragments[0]}//${urlFragments[2]}` + path;
  if (urlFragments[3]) {
    toast.error('Sessão Encerrada');
    window.location.href = baseURL;
  }
}

window.user = JSON.parse(window.localStorage.getItem("userInfo"));
if (window.user) {
  window.user.profilePicture = window.sessionStorage.getItem("profileImage");
}
window.apiToken = window.localStorage.getItem("api-token");
window.apiHost = "http://localhost:3000";

if (window.apiToken) {
  try {
    useServices('refresh', 'POST')
      .then(res => {
        if (res.status == 200) {
          return res.json();
        } else {
          throw navigate('/');
        }
      }).then(json => {
        window.apiToken = json["session-token"];
        window.localStorage.setItem("api-token", window.apiToken);
      });
  } catch (error) {
    navigate('/');
  }
} else {
  navigate('/');
}

const toastOptions = {
  style: {
    fontSize: '22px'
  }
}

function App() {
  return (
    <div className="App">
      <AppRoutes />
      <GlobalStyles />
      <Toaster position="top-right" toastOptions={toastOptions} />
    </div>
  );
}

export default App;
