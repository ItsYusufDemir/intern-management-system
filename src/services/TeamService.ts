import { Team } from "../models/Team";
const controller = new AbortController();

const getTeams = async (axiosInstance: any): Promise<Team[]> => {
    try {
        const response = await axiosInstance.get("/api/teams", {
        signal: controller.signal
      })
        
        const data: Team[] = response.data;

        const teamsData: Team[] = data.map((team: any) => ({
          ...team,
          team_id: parseInt(team.team_id),
        }));

        return teamsData;
      } catch (error) {
        throw error;
      }
}


const addTeam= async (axiosInstance: any, newTeam: Team) => {
  try {
    const response = await axiosInstance.post("/api/teams", newTeam, {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

  } catch (error) {
    console.error("Error adding team:", error);
    throw error;
  }
}


const updateTeam = async (axiosInstance: any, updatedTeam: Team) => {

  try {
    const response = await axiosInstance.put(`/api/teams/${updatedTeam.team_id}`, updatedTeam, {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

const deleteTeam = async (axiosInstance: any, team_id: number) => {
  try {

    const response = await axiosInstance.delete(`/api/teams/${team_id}`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      }
    });

    if (response.status === 200) {
      console.log("Team is deleted");
    } else {
      console.log("Team could NOT be deleted!");
    }
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}





const TeamService = {
    getTeams: getTeams,
    addTeam: addTeam,
    updateTeam: updateTeam,
    deleteTeam: deleteTeam,
}
export default TeamService;