import {Team} from "../models/Team";
import {Intern} from "../models/Intern";
import DashboardComponent from "./DashboardComponent"
import {  useEffect } from "react";
import { useDataContext } from "../App";
import TeamService from "../services/TeamService";




function HomePage() {

    
    const {interns, teams} = useDataContext();

    const numberOfInterns: number[] = [];



    /* In the Dashborad, we show each team's team success. 
       Team success is calculated by overall success of each team member
    */

    useEffect(() => {
        teams.forEach(team => {
            let totalPoint = 0;
            let counter = 0;
            interns.forEach(intern =>{
                console.log(intern.overall_success);
            if(intern.team_id === team.team_id) {
                if(intern.overall_success !== null){
                    totalPoint += intern.overall_success;
                    counter++;
                }
            }
                
    
            })
            numberOfInterns.push(counter);
            team.team_success = (totalPoint / counter);
             
            TeamService.updateTeam(team);
        });

    }, []);

    

    return (

        <>
        <h2 style={{margin: "0"}} id="dashboard-title">Dashboard</h2>

        <div style={{marginLeft: "5%", marginTop: "2%"}}>
            {teams.map((team) => {
                let currentInterns: Intern[] = [];
                interns.forEach(intern =>{
                    if(intern.team_id === team.team_id)
                        currentInterns.push(intern);
                })
                return(
                    <DashboardComponent team={team} interns={currentInterns}></DashboardComponent>
                )
            })}
        </div>
           
        </>
    );
}

export default HomePage;