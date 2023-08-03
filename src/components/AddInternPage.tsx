import InternAddingForm from "./InternAddingForm";
import {Intern} from "../models/Intern";
import { Team } from "../models/Team";
import { useEffect, useState } from "react";
import TeamService from "../services/TeamService";

const AddInternPage = (props: {isEdit: boolean, intern?: Intern}) => {


    const [teams, setTeams] = useState<Team []>();
    const [isLoading, setIsLoading] = useState<boolean>(true);


    // GET ALL DATA FROM DATABASE
    const getData = async () => {
        const teamData = await TeamService.getTeams();
        setTeams(teamData);
    };
    
    useEffect(() => {
        if(isLoading){
            getData();
        }
    }, [isLoading]);

    useEffect(() => {
        if(teams) {
          setIsLoading(false);
        }
      }, [teams])

    
    return ( 
        <>
        {isLoading ? <h2>Loading...</h2> : <InternAddingForm isEdit={props.isEdit} teams={teams!} intern={props.intern}/>}
        </>
     );
}
 
export default AddInternPage;