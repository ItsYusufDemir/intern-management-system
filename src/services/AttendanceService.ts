import axios from "../axios";
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

const getSpecialDays = async (iso: string, year: number) => { //iso: tr.turkish || en.usa
    try {
        const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${iso}%23holiday%40group.v.calendar.google.com/events?key=${process.env.REACT_APP_API_KEY}`, {
            headers: {'Content-Type': 'application/json'},
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}






const AttendanceService = {
    addAttendance: addAttendance,
    getAttendances: getAttendances,
    getSpecialDays: getSpecialDays,
}

export default AttendanceService;