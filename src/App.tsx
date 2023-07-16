import React, { useEffect, useState } from 'react';
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
import { BrowserRouter as Router, Route, useMatch, Routes, useNavigate, useLocation } from "react-router-dom";
import PDFViewer from './components/PDFViewer';



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


let date = new Date(2023, 6, 5);
let date1 = new Date(2023, 7,15);


let newIntern = new Intern("../assets/jamesbond.jpg", "James", "Bond", "11111111111", "5555555555", "Oxford",
 "Computer Engineering", 3,3.52, teams[0],date, date, date1, "../documents/cv.pdf", "example@gmail.com");
let newIntern2 = new Intern("../assets/adele.jpg", "Adele", "Adkins", "", "", "", "", 3,3, teams[0],date, date, date1, "../documents/cv.pdf", "example@gmail.com");
let newIntern3 = new Intern("../assets/bradpitt.jpg", "Brad", "Pitt", "", "", "", "", 3,3, teams[1],date, date, date1, "../documents/cv.pdf", "example@gmail.com");


newIntern.successGrades[0] = 50;
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



const App: React.FC = () => {

const matchInterns = useMatch("/interns");
const matchAddIntern = useMatch("/add-intern");
const matchAddTeam = useMatch("/add-team");
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
    ])
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
              console.log("clicked");
            }
          }}></Menu>
        </Sider>
        <Layout>
          
          <header><h1 className='header-title'>{title}</h1></header><br />


          <Content style={{ margin: '0 16px', padding: 24, minHeight: 500, background: colorBgContainer}}>
            <Routes>
              <Route path="/" element={ <HomePage teams={teams} interns={interns} />} />
              <Route path="/interns" element={ <InternsPage teams={teams} interns={interns}/>} />
              <Route path="/add-intern" element={ <AddInternPage isEdit={false} teams={teams} interns={interns} />} />
              <Route path="/add-team" element={ <AddTeamPage teams={teams}/>} />
              <Route path="/documents/" element={ <PDFViewer pdfUrl='/documents/' />} />
            </Routes>
          </Content>


          <Footer style={{ textAlign: 'center' }}>{footer}</Footer>
        </Layout>
      </Layout>
      
  );
};

export default App;