import { Intern } from "../models/Intern";

const getInterns = async (): Promise<Intern[]> => {
    try {
        const response = await fetch("/api/interns");
        const data: Intern[] = await response.json();

        const internsData: Intern[] = data.map((intern: any) => ({
          ...intern,
          intern_id: parseInt(intern.intern_id),
          grade: parseInt(intern.grade),
          gpa: parseFloat(intern.gpa),
          team_id: parseInt(intern.team_id),
          overall_success: intern.overall_success ? parseFloat(intern.overall_success) : undefined,
          birthday: new Date(intern.birthday),
          internship_starting_date: new Date(intern.internship_starting_date),
          internship_ending_date: new Date(intern.internship_ending_date),
        }));

        return internsData;
      } catch (error) {
        console.error("Error fetching intern data:", error);
        throw new Error("Failed to fetch intern data.");
      }
}


const addIntern = async (newIntern: Intern): Promise<Intern> => {
  try{
    const response = await fetch("/api/interns", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(newIntern),
    });


    const addedIntern: Intern = await response.json();

    return addedIntern;
  }
  catch (error) {
    console.log("Error: ", error);
    throw new Error("Error");
  }
}


const updateIntern = async (updatedIntern: Intern) => {

  try{
    const response = await fetch(("/api/interns/" + updatedIntern.intern_id), {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(updatedIntern),
    });
    if(response.ok){
      console.log("Intern is updated");
    }
    else{
      console.log("Intern could NOT updtated!");
    }
  }
  catch (error) {
    console.log("Error: ", error);
    throw new Error("Error");
  }
}

const deleteIntern = async (deletedIntern: Intern) => {
  try{
    const id = deletedIntern.intern_id;
    const response = await fetch(('/api/interns/' + id), {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if(response.ok){
      console.log("Intern is deleted");
    }
    else{
      console.log("Intern could NOT deleted!");
    }
  }
  catch (error) {
    console.log("Error: ", error);
    throw new Error("Error");
  }
}



const InternService = {
    getInterns: getInterns,
    addIntern: addIntern,
    updateIntern: updateIntern,
    deleteIntern: deleteIntern,
}
export default InternService;