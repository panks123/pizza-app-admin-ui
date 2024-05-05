import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

const NonAuth = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  if(user !== null){
    const retuenTo = new URLSearchParams(location.search).get("returnTo") || "/";
    return <Navigate to={retuenTo} replace/>
  }
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default NonAuth;
