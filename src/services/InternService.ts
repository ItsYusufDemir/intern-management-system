import { useEffect } from "react";
import axios from "../axios";
import { Intern } from "../models/Intern";
import useAxiosPrivate from "../utils/useAxiosPrivate";
const controller = new AbortController();


const getInterns = async (axiosInstance: any): Promise<Intern[] | undefined> => {

    try {
        const response = await axiosInstance.get("/api/interns", {
          signal: controller.signal
        })
        const data: Intern[] = response.data
        const internsData: Intern[] = data.map((intern: any) => ({
          ...intern,
          intern_id: parseInt(intern.intern_id),
          grade: parseInt(intern.grade),
          gpa: parseFloat(intern.gpa),
          team_id: parseInt(intern.team_id),
          overall_success: intern.overall_success ? parseFloat(intern.overall_success) : null,
        }));
        return internsData;
      } catch (error) {
          throw error;
      }
}


const addIntern = async (axiosInstance: any, newIntern: Intern): Promise<Intern | undefined> => {
  try {
    const response = await axiosInstance.post("/api/interns", newIntern, {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });


    const addedIntern: Intern = response.data;
    console.log("added intern: ", addedIntern);

    return addedIntern;
  } catch (error: any) {
      throw error;
  }

}


const updateIntern = async (axiosInstance: any, updatedIntern: Intern) => {
  try {
    console.log()
    const response = await axiosInstance.put(`/api/interns/${updatedIntern.intern_id}`, updatedIntern, {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

  } catch (error) {
      throw error;
  }
}



const deleteIntern = async (axiosInstance: any, deletedIntern: Intern) => {
  try {
    const id = deletedIntern.intern_id;
    await axiosInstance.delete(`/api/interns/${id}`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

  } catch (error) {
    throw error;
  }
}
const getIntern = async (axiosInstance: any, username: number) => {
  try {

    const response = await axiosInstance.get(`/api/interns/${username}`);
    const intern = response.data;

    intern.intern_id = parseInt(intern.intern_id);
    intern.grade = parseInt(intern.grade);
    intern.gpa = parseFloat(intern.gpa);
    intern.team_id = parseInt(intern.team_id);
    intern.overall_success = intern.overall_success ? parseFloat(intern.overall_success) : null;

    return response.data;

  } catch (error) {
    throw error;
  }
}





const InternService  = {
  getInterns: getInterns,
  addIntern: addIntern,
  deleteIntern: deleteIntern,
  updateIntern: updateIntern,
  getIntern: getIntern,
}

export default InternService;

