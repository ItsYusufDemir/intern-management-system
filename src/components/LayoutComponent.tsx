import React, {createContext, useContext, useEffect, useState } from 'react';
import {
  HomeOutlined,
  TeamOutlined,
  SettingOutlined
} from '@ant-design/icons';
import "../styles.css";
import { BrowserRouter as Router, Route, useMatch, Routes, useNavigate, useLocation, Outlet } from "react-router-dom";
import {Team} from "../models/Team";
import { Menu, theme, type MenuProps, Layout } from 'antd';


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
const matchAddTeam = useMatch("/add-team");
const matchAddUser = useMatch("/add-user");
const [seletctedKey, setSelectedKey] = useState("/");
const location = useLocation();


const getSelectedkey = () => {
  if(matchInterns){
    setSelectedKey("/interns");
  }
  else if (matchAddIntern) {
    setSelectedKey("/add-intern");
  }
  else if (matchAddTeam) {
    setSelectedKey("/add-team");
  }
  else if (matchAddUser) {
    setSelectedKey("/add-user");
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
  const items: MenuItem[] = [
    getItem('Home', '/', <HomeOutlined />),
    getItem('Interns', '/interns', <TeamOutlined />),
    getItem('Tools', 'sub1', <SettingOutlined />, [
      getItem('Add Intern', '/add-intern'),
      getItem('Add Team', '/add-team'),
      getItem("Add User", "/add-user"),
    ]),
    
  ];


  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const title = "Intern Management System";
  const footer = "IMS ©2023"


  return (


      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="logo-area"><h1 className='logo' style={{color: "white"}}>LOGO</h1></div>
          
          <Menu theme="dark" defaultSelectedKeys={['/']} mode="inline" items={items} selectedKeys={[seletctedKey]}  onClick={({key}) => {
            if(key === "signout"){
              //Do signout
            }
            else{
              navigate(key);
            }
          }}></Menu>
        </Sider>
        <Layout>
          
          <header><h1 className='header-title'>{title}</h1></header><br />


          <Content style={{ margin: '0 16px', padding: 24, minHeight: 500, background: colorBgContainer}}>
            <Outlet />
          </Content>


          <Footer style={{ textAlign: 'center' }}>{footer}</Footer>
        </Layout>
      </Layout>
      
  );



}

export default LayoutComponent;