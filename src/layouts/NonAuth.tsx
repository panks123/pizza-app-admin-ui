import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

const NonAuth = () => {
  const { user } = useAuthStore();

  if(user !== null){
    return <Navigate to="/" replace/>
  }
  return (
    <div>
      <h1>NonAuth Layout</h1>
      <Outlet />
    </div>
  )
}

export default NonAuth;
