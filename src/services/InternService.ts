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
          /*
          birthday: new Date(intern.birthday),
          internship_starting_date: new Date(intern.internship_starting_date),
          internship_ending_date: new Date(intern.internship_ending_date),
          */
        }));
        return internsData;
      } catch (error) {
          console.error("Error fetching intern data:", error);
          return undefined;
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
    const response = await axiosInstance.delete(`/api/interns/${id}`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    if (response.status === 200) {
      console.log("Intern is deleted");
    } else {
      console.log("Intern could NOT be deleted!");
    }
  } catch (error) {
    console.log("Error: ", error);
    throw new Error("Error deleting intern.");
  }
}





const InternService  = {
  getInterns: getInterns,
  addIntern: addIntern,
  deleteIntern: deleteIntern,
  updateIntern: updateIntern,
}

export default InternService;

