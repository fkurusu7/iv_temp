import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import Editor from "./pages/editor.pages";
import PrivateRoute from "./components/private-route.component";
import Home from "./pages/home.page";

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/editor" element={<Editor />} />
        </Route>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="/signin" element={<UserAuthForm type={"signin"} />} />
          <Route path="/signup" element={<UserAuthForm type={"signup"} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
