import { Assignment } from "../models/Assignment";

const addAssignment = async (axiosInstance: any, newAssignment: Assignment) => {
    try {
        const response = await axiosInstance.post("/api/assignments", newAssignment, {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
        })
    } catch (error) {
        throw error;
    }
}



const AssignmentService = {
    addAssignment: addAssignment,
}

export default AssignmentService;