import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "../axios";
import useAuth from "./useAuth";
import { NoticeType } from "antd/es/message/interface";
import { message } from "antd";
 
const useRefreshToken = () => {
    const { auth, setAuth }: any = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const refresh = async () => {
        try {
            const response = await axios.get("/refresh", {
                withCredentials: true,
            });

            setAuth(
                {
                    username: response.data.username,
                    accessToken:response.data.accessToken,
                    role: response.data.role,

                 })
            return response.data.accessToken; 
        } catch (error) {
            console.log(error);
            setAuth(null);
            navigate("/login", { state: { from: location}, replace: true})
            giveMessage("error", "Session expired, please login")
            
        }
        
    }

    const giveMessage = (type: NoticeType, mssge: string) => {
        message.open({
          type: type,
          content: mssge,
        });
      };

    return refresh;

}


export default useRefreshToken;
