import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  HomeOutlined,
  TeamOutlined,
  SettingOutlined,
  PoweroffOutlined,
  BellOutlined,
  BellFilled,
  SmileOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import "../styles.css";
import { BrowserRouter as Router, Route, useMatch, Routes, useNavigate, useLocation, Outlet } from "react-router-dom";
import {Team} from "../models/Team";
import { Menu, Image, theme, type MenuProps, Layout, Space, Button, message, Badge, Avatar, FloatButton, Popover, List, notification, Divider, Result } from 'antd';
import UserService from '../services/UserService';
import { NoticeType } from 'antd/es/message/interface';
import useAuth from '../utils/useAuth';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import NotificationService from '../services/NotificationService';
import { Notification } from '../models/Notification';
import dayjs from 'dayjs';
import { type } from 'os';


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
const matchChangePassword = useMatch("/change-password");
const matchMyProfile = useMatch("/profile");
//add for other new links
const [seletctedKey, setSelectedKey] = useState("/");
const [items, setItems] = useState<MenuItem []>();
const location = useLocation();
const {auth, setAuth}: any = useAuth();
const [notifications, setNotifications] = useState<Notification []>();
const axiosPrivate = useAxiosPrivate();


const getData = async () => {
  try {
    const notificationsData: Notification [] = await NotificationService.getNotifications(axiosPrivate, auth.user_id);
    processNotifications(notificationsData);
  } catch (error:any) {
    if (!error?.response) {
      console.log(error);
      giveMessage("error", "No server response");
    }  else {
      giveMessage("error", "Error while fetchind data");
    }
  }
}

useEffect(() => {
  getData()
  console.log(auth);
},[auth])



const processNotifications = (notificationsData: Notification []) => {

  //Handle day for ending internship notifications
  notificationsData?.map(notification => {
    if(notification.type_code === 2) {

      const endingDay = dayjs(notification.timestamp * 1000);
      const today = dayjs().startOf("day");

      let dayText = "";
        if (endingDay.isSame(today, "day")) {
          dayText = "today";
        } else if (endingDay.isSame(today.add(1, "day"), "day")) {
          dayText = "tomorrow";
        } else {
          dayText = endingDay.format("dddd");
        }
      notification.content = notification.content + dayText;
    }
  })



  setNotifications(notificationsData);
}


const getSelectedkey = () => {
  if(matchInterns){
    setSelectedKey("/interns");
  }
  else if (matchAddIntern) {
    setSelectedKey("/add-intern");
  }
  else if (matchAddPage) {
    setSelectedKey("/add");
  } else if (matchChangePassword) {
    setSelectedKey("/change-password");
  }
  else if (matchInternApplications) {
    setSelectedKey("/intern-applications");
  } else if (matchMyProfile) {
    setSelectedKey("/profile");
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
      getItem("Change Password", "/change-password"),
    ]),
  ];

  const supervisorItems: MenuItem[] = [
    getItem('Interns', '/interns', <TeamOutlined />),
    getItem('Change Password', '/change-password', <KeyOutlined />),
  ];

  const internItems: MenuItem[] = [
    getItem('My Profile', '/profile', <HomeOutlined />),
    getItem('Change Password', '/change-password', <KeyOutlined />),
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

  const handleSeen = async () => {
    try {
      //await NotificationService.handleSeen(axiosPrivate, auth.user_id);
      
      setNotifications(prevNotifications => {
        return prevNotifications?.map(notification => {
            return { ...notification, is_seen: true };
        });
    });
      

    } catch (error) {
      console.log(error);
    }
  }


  const addAccessToken = (url: string) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}access_token=${auth.accessToken}`;
}



  return (

      <>
      <Layout style={{ minHeight: '98vh' }}>
        <Sider style={{ height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 999 }}>

          <div className="logo-area" style={{marginLeft: "25px"}}>
            <Image width={150} height={150} style={{}} preview={false}
            src={addAccessToken("http://localhost:5000/uploads/photos/issd_logo.png")} />  
          </div>
          
          <Menu theme="dark" defaultSelectedKeys={['/']} mode="inline" items={items} selectedKeys={[seletctedKey]}  onClick={({key}) => {
              navigate(key);
          }}></Menu>


          

          <div className='logout-area' style={{backgroundColor:"#163851", height: "50px", position: "absolute", bottom: "0%", width: "200px", zIndex: 99, display: "inline-block"}}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5px" }}>
              <span style={{fontSize: "20px", fontWeight: "initial", color: "white", marginLeft: "5px"}}>{auth.username}</span>
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
          
          <header className='header'>
            <h1 className='header-title' style={{marginLeft: "20px"}}>{title}</h1>

            <div className='notifications'>

            <Popover placement="bottomRight" content={
              <>
                <Divider orientation='center'>Notifications</Divider>

                {notifications?.length !== 0 && <List
                style={{width: "600px"}}
                itemLayout="horizontal"
                dataSource={notifications?.map(notification => notification.content)}
                renderItem={(item) => (
                    <List.Item>{item}</List.Item>
                )}
               />}

               {notifications?.length === 0 && 
                <Result
                icon={<SmileOutlined />}
                title="You don't have any notifications"
              />
               }


            
              </>
            } trigger="click">

              <div style={{position: "absolute", right: "50px", top: "50px"}}>
              <Badge size='small' offset={[-5,10]} count={notifications?.filter(notification => notification.is_seen === false).length}>
                <Button
                  icon={<BellOutlined />}
                  onClick={handleSeen}
                  size='large'
                  ghost
                  style={{border: "none"}}
                 
                  />
              </Badge>
              </div>
            
            </Popover>
               
                

              
            </div>
          </header>


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