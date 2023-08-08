import { Button, Form, Input, Select, Table, message, theme } from "antd";
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
import UserTable from "./UserTable";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

interface DataType {
    user_id: string;
    username: string;
    role: number;
  }


const AddUserPage = () => {

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [matchPwd, setMatchPwd] = useState("");

    const [role, setRole] = useState();
    const axiosPrivate = useAxiosPrivate();

    const [isLoading, setIsLoading] = useState(true);
    const [teams, setTeams] = useState<Team []>([]);
    const [users, setUsers] = useState<DataType []>([]);

    const userNameErrorMessage = "Username must start with a letter and be 3 to 23 characters long, containing only letters, digits, underscores, and hyphens.";
    const passwordErrorMessage = "Password must contain at least one lowercase letter, at least one uppercase letter, at least one digit (0-9), at least one special character (!@#$%), and be 8 to 24 characters in length.";

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


    const onFinish = async () => {
        addUser();        
    }

    const addUser = async () => {
        try {
            const formData = form.getFieldsValue();

            const newUser: User = {
                username: user,
                password: pwd,
                role: role,
                team: formData.team,
            }

           await UserService.addUser(axiosPrivate, newUser);

           form.resetFields();

           giveMessage("success", "User added");
           
        } catch (error: any) {
            if (!error?.response) {
                giveMessage("error", "No server response");
              } else if (error.response?.status === 409) {
                giveMessage("error", "User already exists");
              } else {
                giveMessage("error", "Error while adding user");
              }
        } finally {
            getData();
        }
        
    }

    const giveMessage = (type: NoticeType, mssge: string) => {
        message.open({
          type: type,
          content: mssge,
        });
    };

    const handleSelectChange = (value: any) => {
        setRole(value);
    }

    //Table

    

      

    return (
        <>
        {isLoading ? <Loading /> : <>
        <h2>Add User</h2>

        <div style={{display: "inline-block"}}>
            <Form style={{maxWidth: 400}}
            onFinish={onFinish}
            form={form}
            labelCol={{span: 10}}
            wrapperCol={{span: 14}}
            autoComplete="off">
                
            <Form.Item
            label="Username"
            name="username"
            rules={[{ 
                required: true,
                message: userNameErrorMessage,
                pattern: /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/ },
            ]}
            hasFeedback
            >
                <Input onChange={(e) => setUser(e.target.value)} />
            </Form.Item>

            <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true,
                message: passwordErrorMessage,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/ }]}
                hasFeedback
            >
                <Input.Password onChange={(e) => setPwd(e.target.value)}/>
            </Form.Item>

            <Form.Item
            label="Confirm Password"
            name="confirm"
            rules={[{ required: true,
                message: "Confirm password!"
                },
                ({getFieldValue}) => ({
                    validator(_, value) {
                        if(!value || getFieldValue("password") === value){
                            return Promise.resolve()
                        }
                        return Promise.reject("Password does not match!");
                    }
                }) 
            ]}
            hasFeedback
            >
                <Input.Password />
            </Form.Item>


            <Form.Item label="Role" name="role" rules={[{required: true, message: "Role is required!"}]}>
                <Select onChange={handleSelectChange}>
                    <Select.Option value={2001}>Intern</Select.Option>
                    <Select.Option value={1984}>Supervisor</Select.Option>
                    <Select.Option value={5150}>Admin</Select.Option>
                </Select>
            </Form.Item>

            {role === 1984  && <Form.Item  label="Responsible For" name="team" rules={[{required: true, message: "Team is required!"}]}>
                <Select>
                    {teams.map(team => {
                        return (
                            <Select.Option value={team.team_name}>{team.team_name}</Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>}
            

            <Form.Item wrapperCol={{span: 24}}>
                <Button block type="primary" htmlType="submit">
                    Add User
                </Button>
            </Form.Item>   

            

            </Form>
        </div>
                
        <br /><br />
        <div>
            <UserTable users={users} />
        </div>
        

        </>}
        </>
    )

}

export default AddUserPage;