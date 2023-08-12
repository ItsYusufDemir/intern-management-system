import { axiosPrivate } from "../axios";
import { Assignment } from "../models/Assignment";
import { Intern } from "../models/Intern";
import InternService from "./InternService";
const controller = new AbortController();

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

const getAssignmentsForIntern = async (axiosInstance: any, intern_id: number): Promise<Assignment []> => {
    try {
        const response = await axiosInstance.get(`/api/assignments/${intern_id}`, {
          signal: controller.signal
      });
  
  
      const assignments: Assignment [] = response.data;
      
        const assignmentsData: Assignment[] = assignments.map((assignment: any) => ({
          ...assignment,
          deadline: Number(assignment.deadline),
        }));
      
      return assignmentsData;
    } catch (error: any) {
        throw error;
    }
}


const updateAssignment = async (axiosInstance: any, assignment: Assignment) => {
    try {
      const response = await axiosInstance.put(`/api/assignments`, assignment, {
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
  
    } catch (error: any) {
        throw error;
    }
}

const deleteAssignment = async (axiosInstance: any, assignment_id: number) => {
  try {
    await axiosInstance.delete(`/api/assignments/${assignment_id}`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
  } catch (error) {
      throw error;
  }
}



const AssignmentService = {
    addAssignment: addAssignment,
    getAssignmentsForIntern: getAssignmentsForIntern,
    updateAssignment: updateAssignment,
    deleteAssignment: deleteAssignment,
}

export default AssignmentService;