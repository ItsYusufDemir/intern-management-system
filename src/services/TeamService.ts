import { Team } from "../models/Team";

const getTeams = async (): Promise<Team[]> => {
    try {
        const response = await fetch("/api/teams");
        const data: Team[] = await response.json();

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


const addTeam= async (newTeam: Team): Promise<Team> => {
  try{
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(newTeam),
    });


    const addedTeam: Team = await response.json();

    return addedTeam;
  }
  catch (error) {
    console.log("Error: ", error);
    throw new Error("Error");
  }
}


const updateTeam = async (updatedTeam: Team) => {

  try{
    const response = await fetch(("/api/teams/" + updatedTeam.team_id), {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(updatedTeam),
    });
    if(response.ok){
      console.log("Team is updated");
    }
    else{
      console.log("Team could NOT updated!");
    }
  }
  catch (error) {
    console.log("Error: ", error);
    throw new Error("Error");
  }
}

const deleteTeam = async (deletedTeam: Team) => {
  try{
    const id = deletedTeam.team_id;
    const response = await fetch(('/api/teams/' + id), {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if(response.ok){
      console.log("Team is deleted");
    }
    else{
      console.log("Team could NOT deleted!");
    }
  }
  catch (error) {
    console.log("Error: ", error);
    throw new Error("Error");
  }
}





const TeamService = {
    getTeams: getTeams,
    addTeam: addTeam,
    updateTeam: updateTeam,
    deleteTeam: deleteTeam,
}
export default TeamService;