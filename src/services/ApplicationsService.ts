import axios from "../axios";
import { Intern } from "../models/Intern";


const addApplication = async (application: Intern) => {
    try {
        const response = await axios.post("/api/applications", application, {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
        })
    } catch (error) {
        throw error;
    }
}

const getApplications = async (axiosInstance: any) => {
    try {
        const response = await axiosInstance.get('/api/applications', {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        });
        
        return response.data;
      } catch (error: any) {
        throw error;
      }
  
  }

const acceptApplication = async (axiosInstance: any, application_id: number) => {
    try {
        await axiosInstance.post(`/api/applications/accept/${application_id}`, {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
        })
    } catch (error) {
        throw error;
    }
}

const rejectApplication = async (axiosInstance: any, application_id: number) => {
    try {
        await axiosInstance.post(`/api/applications/reject/${application_id}`, {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
        })
    } catch (error) {
        throw error;
    }
}

const emptyArchieve = async (axiosInstance: any) => {
    try {
        await axiosInstance.delete("/api/applications");
    } catch (error) {
        throw error;
    }
}




const ApplicationService = {
    addApplication: addApplication,
    getApplications: getApplications,
    acceptApplication: acceptApplication,
    rejectApplication: rejectApplication,
    emptyArchieve: emptyArchieve,
}

export default ApplicationService;