import React, { useContext, useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import useAuth from '../utils/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from "../utils/AuthProvider";
import UserService from '../services/UserService';
import { User } from '../models/User';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import { NoticeType } from 'antd/es/message/interface';

function Login() {

    const { auth, setAuth }:any = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


    const [form] = Form.useForm();

    const [userName, setUserName] = useState("");
    const [pwd, setPwd] = useState("");


    const [user, setUser] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = () => {
        login();    
    }



    const login = async () => {
        const formValues = form.getFieldsValue();

        console.log(formValues.username, formValues.password);
        const user: User = {
            username:formValues.username,
            password: formValues.password,
        }

        try {
            const response = await UserService.login(axiosPrivate, user);

            if(response.accessToken !== undefined) {
                const role = response.role;
                const accessToken = response.accessToken;
                const username = user.username;
    
                console.log("role:", role,"access: ", accessToken);
                setAuth({username, pwd, role, accessToken});
                giveMessage("success", "Login successfull");
                navigate(from, {replace: true});

                form.resetFields();
            }
        } catch (error:any ) {
            if (!error?.response) {
                giveMessage("error", "No server response");
              } else if (error.response?.status === 401) {
                giveMessage("error", "Invalid Username or Password!");
              } else {
                giveMessage("error", "Login failed!");
              }
        }
    }

    const giveMessage = (type: NoticeType, mssge: string) => {
        message.open({
          type: type,
          content: mssge,
        });
      };



    return(
        <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',}}>
            <div style={{border: "2px solid black", padding: "10px", paddingTop: "50px" , borderRadius: "10px" }}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                        <Input.Password />
                    </Form.Item>

                    

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
             </div>

        </div>

        </>
        
        
        
        
        
        
        
        
       
    )
}

export default Login;