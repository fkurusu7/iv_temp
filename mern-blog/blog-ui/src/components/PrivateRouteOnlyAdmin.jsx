import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRouteOnlyAdmin() {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && currentUser.user.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to={"/dashboard?tab=profile"} />
  );
}

export default PrivateRouteOnlyAdmin;
