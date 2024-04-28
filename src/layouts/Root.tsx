import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { self } from "../http/api";
import { useAuthStore } from "../store";
import { usePermisson } from "../hooks/usePermission";
import { AxiosError } from "axios";

const getSelf = async () => {
    const { data } =  await self();
    return data;
}

const Root = () => {
    const { setUser, user } = useAuthStore();
    const { isAllowed } = usePermisson();

    const { data: userData, isLoading, refetch } = useQuery({
        queryKey: ["self"],
        queryFn: getSelf,
        enabled: false,
        retry: (failureCount: number, error) => {
            if(error instanceof AxiosError && error.response?.status === 401 ) {
                return false;
            }

            return failureCount < 3;
        } 
    })

    useEffect(() => {
        if(!user) {
            refetch();
        }
    }, [refetch, user]);

    useEffect(() => {
        if(!user && userData && isAllowed(userData) ) {
            setUser(userData);
        }
    }, [user, userData, setUser, isAllowed]);

    if(isLoading) {
        return <div>Loading...</div>
    }

  return (
    <Outlet />
  )
}

export default Root;
