import React, { useState } from 'react';
import {
  HomeOutlined,
  TeamOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme, type MenuProps } from 'antd';
import "./styles.css";
import HomePage from "./components/HomePage";
import InternsPage from './components/InternsPage';
import AddInternPage from './components/AddInternPage';
import AddTeamPage from './components/AddTeamPage';







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

const items: MenuItem[] = [
  getItem('Home', '1', <HomeOutlined />),
  getItem('Interns', '2', <TeamOutlined />),
  getItem('Tools', 'sub1', <SettingOutlined />, [
    getItem('Add Intern', '3'),
    getItem('Add Team', '4'),
  ]),

];

const App: React.FC = () => {

  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  const handleMenuClick = (item: { key: React.SetStateAction<string>; }) => {
    setSelectedMenuItem(item.key);
   };

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const title = "Intern Management System";
  const footer = "IMS ©2023"


  const handleSiderClick = () => {
    console.log("You clicked sider");
  }




  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo-area"><h1 className='logo' style={{color: "white"}}>LOGO</h1></div>
        
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleMenuClick} />
      </Sider>
      <Layout>
        {/*<!--<Header style={{ padding: 0, background: colorBgContainer }} />*/}
        <header><h1 className='header-title'>{title}</h1></header><br />
        <Content style={{ margin: '0 16px'}}>
          {/*<Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>*/}
          <div style={{ padding: 24, minHeight: 500, background: colorBgContainer}}>
            {selectedMenuItem === "1" && <HomePage />}
            {selectedMenuItem === "2" && <InternsPage/>}
            {selectedMenuItem === "3" && <AddInternPage />}
            {selectedMenuItem === "4" && <AddTeamPage/>}

          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>{footer}</Footer>
      </Layout>
    </Layout>
  );
};

export default App;