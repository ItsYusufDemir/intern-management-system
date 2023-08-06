import {Team} from "../models/Team";
import {Intern} from "../models/Intern";
import DashboardComponent from "./DashboardComponent"
import {  useEffect, useState } from "react";
import TeamService from "../services/TeamService";
import InternService from "../services/InternService";
import useRefreshToken from "../utils/useRefreshToken";
import { useFetcher } from "react-router-dom";
import useAxiosPrivate from "../utils/useAxiosPrivate";

 




function HomePage() {

    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    

   





    const [interns, setInterns] = useState<Intern []>();
    const [teams, setTeams] = useState<Team []>();
    const [isLoading, setIsLoading] = useState<boolean>(true);


    // GET ALL DATA FROM DATABASE
    const getData = async () => {
        const internData = await InternService.getInterns(axiosPrivate);
        setInterns(internData);

        const teamData = await TeamService.getTeams(axiosPrivate);
        setTeams(teamData);
    };
    
    useEffect(() => {
        if(isLoading){
            getData();
        }
    }, [isLoading]);

    useEffect(() => {
      if(interns && teams)
        console.log(interns, teams);
    }, [interns, teams])

    
    useEffect(() => {
      if(teams && interns) {
        setIsLoading(false);
      }
    }, [teams, interns])




    const numberOfInterns: number[] = [];



    /* In the Dashborad, we show each team's team success. 
       Team success is calculated by overall success of each team member
    */

    useEffect(() => {

        if(!isLoading){

            teams?.forEach(team => {
                let totalPoint = 0;
                let counter = 0;
                interns?.forEach(intern =>{
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
                
                TeamService.updateTeam(axiosPrivate, team);
            });
        }

    }, [isLoading]);

    
    if(isLoading){
        return (
            <><h2>Loading...</h2></>
        )
    }
    else{
        return (

            <>
            <h2 style={{margin: "0"}} id="dashboard-title">Dashboard</h2>

            <div style={{marginLeft: "5%", marginTop: "2%"}}>
                {teams?.map((team) => {
                    let currentInterns: Intern[] = [];
                    interns?.forEach(intern =>{
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
}

export default HomePage;