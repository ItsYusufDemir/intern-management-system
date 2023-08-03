import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth";

const RequireAuth = ({allowedRoles}: any) => {
    //const { auth }: any = useAuth();
    const location = useLocation(); 

    const auth = 2;


    return(
        auth? <Outlet /> : <Navigate to = "/login" state = {{from: location}} replace /> 
    )

}

export default RequireAuth;