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
          overall_success: parseFloat(team.team_success),
        }));


        return teamsData;
      } catch (error) {
        console.error("Error fetching team data:", error);
        throw new Error("Failed to fetch team data.");
      }
}


const addTeam= async (axiosInstance: any, newTeam: Team): Promise<Team | undefined> => {
  try {
    const response = await axiosInstance.post("/api/teams", newTeam, {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    const addedTeam: Team = response.data;

    return addedTeam;
  } catch (error) {
    console.error("Error adding team:", error);
    return undefined;
  }
}


const updateTeam = async (axiosInstance: any, updatedTeam: Team) => {

  try {
    const response = await axiosInstance.put(`/api/teams/${updatedTeam.team_id}`, updatedTeam, {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    if (response.status === 200) {
      console.log("Team is updated");
    } else {
      console.log("Team could NOT be updated!");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

const deleteTeam = async (axiosInstance: any, deletedTeam: Team) => {
  try {
    const id = deletedTeam.team_id;
    const response = await axiosInstance.delete(`/api/teams/${id}`, {
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
  }
}





const TeamService = {
    getTeams: getTeams,
    addTeam: addTeam,
    updateTeam: updateTeam,
    deleteTeam: deleteTeam,
}
export default TeamService;