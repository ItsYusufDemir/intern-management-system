import {Team} from "../models/Team";
import {Intern} from "../models/Intern";
import DashboardComponent from "./DashboardComponent"
import { useEffect } from "react";

function HomePage(props: {teams: Team[], interns: Intern[]}) {

    const teams = props.teams;
    const interns = props.interns;

    const numberOfInterns: number[] = [];


   


    /* In the Dashborad, we show each team's team success. 
       Team success is calculated by overall success of each team member
    */
    teams.forEach(team => {
        let totalPoint = 0;
        let counter = 0;
        interns.forEach(intern =>{
        if(intern.team.name === team.name)
            if(intern.overallSuccess !== undefined){
                totalPoint += intern.overallSuccess;
                counter++;
            }

        })
        numberOfInterns.push(counter);
        team.teamSuccess = (totalPoint / counter);
    })

    return (

        <>
        <h2 style={{margin: "0"}} id="dashboard-title">Dashboard</h2>

        <div style={{marginLeft: "5%", marginTop: "2%"}}>
            {teams.map((team) => {
                let currentInterns: Intern[] = [];
                interns.forEach(intern =>{
                    if(intern.team.name === team.name)
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