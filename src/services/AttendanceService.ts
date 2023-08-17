import { Attendance } from "../models/Attendance";



const addAttendance = async (axiosInstance: any, attendance: Attendance) => {
    try {
        const response = await axiosInstance.post("/api/attendances", attendance, {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
        })
    } catch (error) {
        throw error;
    }
}

const getAttendances = async (axiosInstance: any, intern_id: number) => {
    try {
        const response = await axiosInstance.get(`/api/attendances/${intern_id}`, {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
        })

        return response.data;
    } catch (error) {
        throw error;
    }
}





const AttendanceService = {
    addAttendance: addAttendance,
    getAttendances: getAttendances,
}

export default AttendanceService;