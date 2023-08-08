import axios from '../axios';
import { User } from "../models/User";

const addUser = async (axiosInstance: any, user: User) => {
    try {
        const response = await axiosInstance.post('/api/users', user, {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        });
    
      } catch (error: any) {
        throw error;
      }

}

const getUsers = async (axiosInstance: any) => {
  try {
      const response = await axiosInstance.get('/api/users', {
        headers: {'Content-Type': 'application/json'},
        withCredentials: true,
      });
      
      return response.data;
    } catch (error: any) {
      throw error;
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
        throw error;
      }

}

const logout = async () => {

  try {
      const response = await axios.get('/logout', {
        headers: {'Content-Type': 'application/json'},
        withCredentials: true,
      });
    } catch (error: any) {
      throw error;
    }
}

const deleteUser = async (axiosInstance: any, username: string) => {
  try {
    const response = await axiosInstance.delete(`/api/users/${username}`, {
      headers: {'Content-Type': 'application/json'},
      withCredentials: true,
    });
    return;
  } catch (error: any) {
    throw error;
  }
}


const UserService = {
    addUser: addUser,
    login: login,
    logout: logout,
    getUsers: getUsers,
    deleteUser: deleteUser,
}
export default UserService;