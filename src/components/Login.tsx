import React, { useContext, useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import useAuth from '../utils/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from "../utils/AuthProvider";
import UserService from '../services/UserService';
import { User } from '../models/User';
import useAxiosPrivate from '../utils/useAxiosPrivate';

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

    const onFinish = async () => {

        const formValues = form.getFieldsValue();

        console.log(formValues.username, formValues.password);
        const user: User = {
            username:formValues.username,
            password: formValues.password,
        }

        const response = await UserService.login(axiosPrivate, user);

        if(response.accessToken !== undefined) {
            const role = response.role;
            const accessToken = response.accessToken;

            console.log("role:", role,"access: ", accessToken);
            setAuth({user, pwd, role, accessToken});
            navigate(from, {replace: true});
        }
        else{
            alert("Invalid Username or Password!");
        }

        form.resetFields();
    }



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

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{ offset: 8, span: 16 }}
                        >
                        <Checkbox>Remember me</Checkbox>
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