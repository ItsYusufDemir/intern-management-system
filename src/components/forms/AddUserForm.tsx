import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import UserService from "../../services/UserService";
import { User } from "../../models/User";
import { NoticeType } from "antd/es/message/interface";
import { Team } from "../../models/Team";

interface PropType {
    teams: Team [];
    userToUpdate?: DataType;
}

interface DataType {
    user_id: number;
    username: string;
    role: number;
    team?: string;
  }

const AddUserForm: React.FC<PropType> = ({teams, userToUpdate}) => {

    
    const userNameErrorMessage = "Username must start with a letter and be 3 to 23 characters long, containing only letters, digits, underscores, and hyphens.";
    const passwordErrorMessage = "Password must contain at least one lowercase letter, at least one uppercase letter, at least one digit (0-9), at least one special character (!@#$%), and be 8 to 24 characters in length.";

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [user, setUser] = useState("");

    const axiosPrivate = useAxiosPrivate();
    const [pwd, setPwd] = useState("");
    const [role, setRole] = useState<number>();


    const onFinish = () => {
        if(userToUpdate){
            console.log("bu değil mi")
            updateUser();
        }else{
            addUser();
        }
                
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
            setTimeout(()=> {
                navigate(0);
            }, 700)
        }
        
    }

    useEffect(() => {
        if(userToUpdate) {
            setRole(userToUpdate.role);
            setUser(userToUpdate.username);
            form.setFieldsValue({
                username: userToUpdate.username,
                role: userToUpdate.role,
            })
            if(userToUpdate.team) {
                form.setFieldsValue({
                    team: userToUpdate.team,
                })
            }
        }

    }, [userToUpdate])

    const updateUser = async () => {
        try {
            const formData = form.getFieldsValue();

            const newUser: User = {
                user_id: userToUpdate?.user_id!,
                username: user,
                password: pwd,
                role: role,
                team: formData.team,
            }

           await UserService.updateUser(axiosPrivate, newUser);

           form.resetFields();

           giveMessage("success", "User updated");
           
        } catch (error: any) {
            if (!error?.response) {
                giveMessage("error", "No server response");
              }  else {
                giveMessage("error", "Error while updating user");
              }
        } finally {
            setTimeout(()=> {
                navigate(0);
            }, 700)
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


    return (
        <>
         <div>
                <Form style={{width: 400}}
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
                        {userToUpdate ? <>Update User</> : <>Add User</>}
                    </Button>
                </Form.Item>   

                

                </Form>
            </div>
        </>
      );
}
 
export default AddUserForm;