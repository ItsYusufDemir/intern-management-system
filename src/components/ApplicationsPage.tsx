import { useEffect, useState } from "react";
import { Intern } from "../models/Intern";
import { Team } from "../models/Team";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import InternApplicationsTable from "./tables/InternApplicationsTable";
import ApplicationService from "../services/ApplicationsService";
import Loading from "./Loading";
import TeamService from "../services/TeamService";
import { NoticeType } from "antd/es/message/interface";
import { Tabs, message } from "antd";
import TabPane from "antd/es/tabs/TabPane";

const Applications = () => {


    //fetch applications data, you will have two operations, accept and reject, add tags to the table waiting, accepted, rejected
    //Keep the application data in an another table ind the db. When you accept it, transfer the data to the interns table,
    //when you reject, do nothing to the application data,
    //We can also have a delete application button, to delete the application
    const axiosPrivate = useAxiosPrivate();
    const [applications, setApplications] = useState<Intern []>();
    const [isLoading, setIsLoading] = useState(true);
    const [teams, setTeams] = useState<Team []>();

     // GET ALL DATA FROM DATABASE
     const getData = async () => {

      try {
        
        const applicationsData = await ApplicationService.getApplications(axiosPrivate);
        setApplications(applicationsData);

        const teamsData = await TeamService.getTeams(axiosPrivate);
        setTeams(teamsData);

      } catch (error: any) {
        if (!error?.response) {
          giveMessage("error", "No server response");
        }  else {
          giveMessage("error", "Error while fetchind data");
        }
      }

    };
    
    useEffect(() => {
        if(isLoading){
            getData();
        }
    }, [isLoading]);

    useEffect(() => {
        if(applications && teams) {
          setIsLoading(false);
        }
      }, [applications, teams])



    const refetchData = async () => {
      try {
        const applicationsData = await ApplicationService.getApplications(axiosPrivate);
        setApplications(applicationsData);

        const teamsData = await TeamService.getTeams(axiosPrivate);
        setTeams(teamsData);

      } catch (error: any) {
        if (!error?.response) {
          giveMessage("error", "No server response");
        }  else {
          giveMessage("error", "Error while fetchind data");
        }
      }
    }

    
    const giveMessage = (type: NoticeType, mssge: string) => {
      message.open({
        type: type,
        content: mssge,
      });
    };



    return (
      <>
        {isLoading ? <Loading /> : <>
        <h2>Intern Applications</h2>

        <div className='applications-table'>
            <Tabs defaultActiveKey='1' size='middle' >
                <TabPane tab="Waiting" key="1">
                  <InternApplicationsTable applications={applications!.filter(application => application.application_status === "waiting")} refetchData={refetchData} teams={teams!}/>
                </TabPane>
                <TabPane tab="Archive" key="2">
                  <InternApplicationsTable applications={applications!.filter(application => application.application_status === "accepted" || application.application_status === "rejected" )} refetchData={refetchData} teams={teams!}/>
                </TabPane>
            </Tabs>
        </div>
        
        </>}
      </>
      );
}
 
export default Applications;