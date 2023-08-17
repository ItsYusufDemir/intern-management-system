import React, {createContext, useContext, useEffect, useState } from 'react';
import {
  HomeOutlined,
  TeamOutlined,
  SettingOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import "../styles.css";
import { BrowserRouter as Router, Route, useMatch, Routes, useNavigate, useLocation, Outlet } from "react-router-dom";
import {Team} from "../models/Team";
import { Menu, theme, type MenuProps, Layout, Space, Button, message } from 'antd';
import UserService from '../services/UserService';
import { axiosPrivate } from '../axios';
import { NoticeType } from 'antd/es/message/interface';
import useAuth from '../utils/useAuth';
import useAxiosPrivate from '../utils/useAxiosPrivate';


var teams: Team[] = [];

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}




const LayoutComponent = () => {
    

const matchInterns = useMatch("/interns");
const matchAddIntern = useMatch("/add-intern");
const matchAddPage = useMatch("/add");
const matchInternApplications = useMatch("/intern-applications");
//add for other new links
const [seletctedKey, setSelectedKey] = useState("/");
const [items, setItems] = useState<MenuItem []>();
const location = useLocation();
const {auth}: any = useAuth();
const [username, setUsername] = useState("");


const getSelectedkey = () => {
  if(matchInterns){
    setSelectedKey("/interns");
  }
  else if (matchAddIntern) {
    setSelectedKey("/add-intern");
  }
  else if (matchAddPage) {
    setSelectedKey("/add");
  } else if (matchInternApplications) {
    setSelectedKey("/intern-applications");
  }
  else {
    setSelectedKey("/");
  }
};

//This renders the menu selected item, when the path changes
useEffect(() => {
  getSelectedkey();
}, [location.pathname]);


  const navigate = useNavigate();


  //In the side bar, we have a menu. Those are the navigate items
  const adminItems: MenuItem[] = [
    getItem('Home', '/', <HomeOutlined />),
    getItem('Interns', '/interns', <TeamOutlined />),
    getItem('Intern Applications', '/intern-applications', <TeamOutlined />),
    getItem('Tools', 'sub1', <SettingOutlined />, [
      getItem("Add User/Team", "/add"),
      getItem("Add Intern", "/add-intern"),
    ]),
    getItem('Change Password', '/change-password', <TeamOutlined />),
  ];

  const supervisorItems: MenuItem[] = [
    getItem('Home', '/', <HomeOutlined />),
    getItem('Interns', '/interns', <TeamOutlined />),
    getItem('Change Password', '/change-password', <TeamOutlined />),
  ];

  const internItems: MenuItem[] = [
    getItem('My Profile', '/', <HomeOutlined />),
    getItem('Change Password', '/change-password', <TeamOutlined />),
  ];


  useEffect(() => {
    if(auth) {
      if(auth.role === 5150) {
        setItems(adminItems);
      }
      else if(auth.role === 1984) {
        setItems(supervisorItems);
      }
      else {
        setItems(internItems);
      }
    }
  }, [auth])


  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const title = "Intern Management System";
  const footer = "IMS ©2023"

  const logout = async () => {
    UserService.logout();
  }

  const onClick = () => {
    logout();

    giveMessage("success", "Log out successfull");
    navigate("/login");
  }

  const giveMessage = (type: NoticeType, mssge: string) => {
    message.open({
      type: type,
      content: mssge,
    });
  };



  return (

      <>
      <Layout style={{ minHeight: '98vh' }}>
        <Sider style={{ height: '100vh', position: 'fixed', left: 0, top: 0 }}>
          <div className="logo-area"><h1 className='logo' style={{color: "white"}}>LOGO</h1></div>
          
          <Menu theme="dark" defaultSelectedKeys={['/']} mode="inline" items={items} selectedKeys={[seletctedKey]}  onClick={({key}) => {
              navigate(key);
          }}></Menu>


          

          <div className='logout-area' style={{backgroundColor:"#163851", height: "50px", position: "absolute", bottom: "0%", width: "200px", zIndex: 99, display: "inline-block"}}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5px" }}>
              <span style={{fontSize: "25px", fontWeight: "initial", color: "white", marginLeft: "5px"}}>{auth.username}</span>
              <Button
                type="primary"
                icon={<PoweroffOutlined />}
                style={{marginLeft: "30px"}}
                size='large'
                onClick={onClick}
                danger
                ghost
                />
            </div>
          </div>

        </Sider>
        <Layout style={{marginLeft: 200, marginTop: 0,}}>
          
          <header className='header'><h1 className='header-title' style={{marginLeft: "20px"}}>{title}</h1></header>


          <Content className='content'>
            <Outlet />
          </Content>


          <Footer style={{ textAlign: 'center' }}>{footer}</Footer>
        </Layout>
      </Layout>
      </>
      
  );



}

export default LayoutComponent;