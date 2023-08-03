import axios from '../axios';
import { User } from "../models/User";

const addUser = async (user: User): Promise<boolean> => {

    try {
        const response = await axios.post('/api/users',
            JSON.stringify(user),
             {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true,
             }
        )

        return true;
    } catch (error: any) {
        if(!error?.response){
            console.log("No server response");
        }
        else if (error.response?.status === 409) {
            console.log("User is already exists");
        }
        else{
            console.log("Error while adding user");
        }
        return false;
    }

}


const login = async (user: User) => {

    try {
        const response = await axios.post('/auth',
            JSON.stringify(user),
             {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true,
             }
        )

        return response.data;
    } catch (error: any) {
        if(!error?.response){
            console.log("No server response");
        }
        else if (error.response?.status === 401) {
            console.log("Unauthorized");
        }
        else{
            console.log("Error while login");
        }
        return false;
    }

}


const UserServie = {
    addUser: addUser,
    login: login,
}
export default UserServie;