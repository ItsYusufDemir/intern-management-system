import React, { useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import useAuth from '../utils/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

function Login() {

    //const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [form] = Form.useForm();


    const [user, setUser] = useState("");
    

    const onFinish = () => {

        const formValues = form.getFieldsValue();

        console.log(formValues.username, formValues.password);

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