import {Team} from "../models/Team";
import {Intern} from "../models/Intern";
import DashboardComponent from "./DashboardComponent"
import {  useEffect, useState } from "react";
import TeamService from "../services/TeamService";
import InternService from "../services/InternService";
import useRefreshToken from "../utils/useRefreshToken";
import { useFetcher } from "react-router-dom";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import Loading from "./Loading";
import { message } from "antd";
import { NoticeType } from "antd/es/message/interface";

 




function HomePage() {

    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const [interns, setInterns] = useState<Intern []>();
    const [teams, setTeams] = useState<Team []>();
    const [isLoading, setIsLoading] = useState<boolean>(true);


    // GET ALL DATA FROM DATABASE
    const getData = async () => {
        try {
            const internData = await InternService.getInterns(axiosPrivate);
        setInterns(internData);

        const teamData = await TeamService.getTeams(axiosPrivate);
        setTeams(teamData);
        } catch (error: any) {
            if (!error?.response) {
                giveMessage("error", "No server response");
              }  else {
                giveMessage("error", "Error while fetchind data");
              }
        } finally{
            setIsLoading(false);
        }
        
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

    const giveMessage = (type: NoticeType, mssge: string) => {
        message.open({
          type: type,
          content: mssge,
        });
    };


    const numberOfInterns: number[] = [];



    /* In the Dashborad, we show each team's team success. 
       Team success is calculated by overall success of each team member
    */

    

    
    if(isLoading){
        return (
            <Loading />
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
                        <></>
                    )
                })}
            </div>
            </>
        );
    }
}

export default HomePage;