import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../utils/useRefreshToken";
import useAuth from "../utils/useAuth";


const PersistLogin = () => {
    const [iLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth }: any = useAuth();

}