import { Button, Form, Input, Modal, Select, Space, Table, message, theme } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { User } from "../models/User"
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { NoticeType } from "antd/es/message/interface";
import { Team } from "../models/Team";
import TeamService from "../services/TeamService";
import Loading from "./Loading";
import { ColumnsType } from "antd/es/table";
import UserTable from "./tables/UserTable";
import TeamTable from "./tables/TeamTable";
import AddTeamForm from "./forms/AddTeamForm";
import AddUserForm from "./forms/AddUserForm";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

interface DataType {
    user_id: number;
    username: string;
    role: number;
    team?: string;
  }


const AddPage = () => {

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [form2] = Form.useForm();

    const [user, setUser] = useState("");

    const [pwd, setPwd] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [role, setRole] = useState();
    const axiosPrivate = useAxiosPrivate();

    const [isLoading, setIsLoading] = useState(true);
    const [teams, setTeams] = useState<Team []>([]);
    const [users, setUsers] = useState<DataType []>([]);


    // GET ALL DATA FROM DATABASE
    const getData = async () => {
        const teamData = await TeamService.getTeams(axiosPrivate);
        setTeams(teamData);

        const userData = await UserService.getUsers(axiosPrivate);
        setUsers(userData);
    };
    
    useEffect(() => {
        if(isLoading){
            getData();
        }
    }, [isLoading]);
    
    useEffect(() => {
      if(teams && users) {
        console.log("users", users);
        setIsLoading(false);
      }
    }, [teams, users])


    return (
        <>
        {isLoading ? <Loading /> : <>
        <h2>Add User</h2>

        {/*Add User*/}
        <Space align="start">
           
            <AddUserForm teams={teams} />
                    
            <div style={{marginLeft: 100}}>
                <UserTable users={users} teams={teams} />
            </div>
        </Space>


        {/*Add Team*/}
        <h2>Add Team</h2>
        <Space align="start">
            <AddTeamForm/>
          
            <div style={{marginLeft: "100px"}}>
                <TeamTable teams={teams} />
            </div>
        </Space>

        </>}
        </>
    )

}

export default AddPage;