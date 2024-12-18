import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="/signin" element={<UserAuthForm type={"signin"} />} />
          <Route path="/signup" element={<UserAuthForm type={"signup"} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
