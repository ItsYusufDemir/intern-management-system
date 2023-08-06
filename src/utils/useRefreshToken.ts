import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "../axios";
import useAuth from "./useAuth";
 
const useRefreshToken = () => {
    const { setAuth }: any = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const refresh = async () => {
        try {
            const response = await axios.get("/refresh", {
                withCredentials: true,
            });
            setAuth((prev: any) => {
                return {...prev, accessToken: response.data.accessToken}
            })
            return response.data.accessToken; 
        } catch (error) {
            console.log(error);
            setAuth(null);
            navigate("/login", { state: { from: location}, replace: true})
            
        }
        
    }

    return refresh;

}


export default useRefreshToken;
