import axios from '../axios';
import { User } from "../models/User";

const addUser = async (axiosInstance: any, user: User): Promise<boolean> => {

    try {
        const response = await axiosInstance.post('/api/users', user, {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        });
    
        return true;
      } catch (error: any) {
        if (!error?.response) {
          console.log("No server response");
        } else if (error.response?.status === 409) {
          console.log("User already exists");
        } else {
          console.log("Error while adding user");
        }
        return false;
      }

}


const login = async (axiosInstance: any, user: User) => {

    try {
        const response = await axiosInstance.post('/auth', user, {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        });
    
        return response.data;
      } catch (error: any) {
        if (!error?.response) {
          console.log("No server response");
        } else if (error.response?.status === 401) {
          console.log("Unauthorized");
        } else {
          console.log("Login failed!");
        }
        return false;
      }

}


const UserServie = {
    addUser: addUser,
    login: login,
}
export default UserServie;