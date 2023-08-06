import { Button, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { User } from "../models/User"
import useAxiosPrivate from "../utils/useAxiosPrivate";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;




const AddUserPage = () => {

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [matchPwd, setMatchPwd] = useState("");

    const [role, setRole] = useState("");
    const axiosPrivate = useAxiosPrivate();

    const userNameErrorMessage = "Username must start with a letter and be 3 to 23 characters long, containing only letters, digits, underscores, and hyphens.";
    const passwordErrorMessage = "Password must contain at least one lowercase letter, at least one uppercase letter, at least one digit (0-9), at least one special character (!@#$%), and be 8 to 24 characters in length.";




    const onFinish = async () => {

        

        const formData = form.getFieldsValue();

        
        //form.resetFields();

        const newUser: User = {
            username: user,
            password: pwd,
            role: formData.role,
        }

        console.log(newUser);

        const result = await UserService.addUser(axiosPrivate, newUser);

        console.log("burası:", result);
        if(result){
            alert("User added");
        }
        else{
            alert("User is aldready exists");
        }

        
    }

    useEffect(() => {
        console.log(role);
    }, [role])

    return (
        <>
        <h2>Add User</h2>

        <div>
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
                <Select>
                    <Select.Option value="2001">Intern</Select.Option>
                    <Select.Option value="1984">Supervisor</Select.Option>
                    <Select.Option value="5150">Admin</Select.Option>
                </Select>
            </Form.Item>
            

            <Form.Item wrapperCol={{span: 24}}>
                <Button block type="primary" htmlType="submit">
                    Add User
                </Button>
            </Form.Item>   

            

            </Form>
        </div>
        

        </>
    )

}

export default AddUserPage;