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
import {Team} from "./models/Team";
import {Intern} from "./models/Intern";
import {Program} from "./models/Program";



/******************Database************************/
var teams: Team[] = [];
var interns: Intern[] = [];


let fullStackCurriculum: Program[] = []
let newMission = new Program(1, "Javasciprt Öğren");
let newMission2 = new Program(2, "React Öğren");
fullStackCurriculum.push(newMission);
fullStackCurriculum.push(newMission2);

let embeddedCurriculum: Program[] = []
let newMission3 = new Program(1, "Eve git");
let newMission4 = new Program(2, "Uyu");
embeddedCurriculum.push(newMission3);
embeddedCurriculum.push(newMission4);


let fullStackTeam = new Team("Full Stack", fullStackCurriculum);
let embeddedTeam = new Team("Embedded", embeddedCurriculum);

teams.push(fullStackTeam);
teams.push(embeddedTeam);


let date = new Date(2023, 6, 3);
let date1 = new Date(2023, 7,15);

let newIntern = new Intern("../assets/jamesbond.jpg", "James", "Bond", "11111111111", "5555555555", "Oxford",
 "Computer Engineering", 3,3.52, teams[0], date, date1, "../documents/cv.pdf", "example@gmail.com");
let newIntern2 = new Intern("../assets/adele.jpg", "Adele", "Adkins", "", "", "", "", 3,3, teams[0], date, date1, "../documents/cv.pdf", "example@gmail.com");
let newIntern3 = new Intern("../assets/bradpitt.jpg", "Brad", "Pitt", "", "", "", "", 3,3, teams[1], date, date1, "../documents/cv.pdf", "example@gmail.com");


newIntern.başarıPuanı[0] = 50;
newIntern.computeOverallSuccess();

interns.push(newIntern);
interns.push(newIntern2);
interns.push(newIntern3);

/*******************Database***********************/






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
            {selectedMenuItem === "1" && <HomePage teams={teams} interns={interns} />}
            {selectedMenuItem === "2" && <InternsPage teams={teams} interns={interns} />}
            {selectedMenuItem === "3" && <AddInternPage isEdit={false}/>}
            {selectedMenuItem === "4" && <AddTeamPage/>}

          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>{footer}</Footer>
      </Layout>
    </Layout>
  );
};

export default App;