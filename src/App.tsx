import React, {createContext, useContext, useEffect, useState } from 'react';
import {
  HomeOutlined,
  TeamOutlined,
  SettingOutlined
} from '@ant-design/icons';
import "./styles.css";
import HomePage from "./components/HomePage";
import InternsPage from './components/InternsPage';
import AddInternPage from './components/AddInternPage';
import AddTeamPage from './components/AddTeamPage';
import NotFound from './components/Notfound';
import { BrowserRouter as Router, Route, useMatch, Routes, useNavigate, useLocation } from "react-router-dom";
import PDFViewer from './components/PDFViewer';
import {Team} from "./models/Team";
import {Intern} from "./models/Intern";
import { Layout, Menu, theme, type MenuProps } from 'antd';
import InternService from './services/InternService';
import TeamService from './services/TeamService';



const DataContext = createContext<{interns: Intern[]; teams: Team[], isLoading: boolean;}>({interns: [], teams: [], isLoading: true});
export const useDataContext = () => {
  const context = useContext(DataContext);

  return context;
}

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



const App: React.FC = () => {


const [interns, setInterns] = useState<Intern[]>([]);
const [teams, setTeams] = useState<Team[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);

useEffect(() => {
  getData();
},[])

//GET ALL DATA FROM DATABASE
const getData = async () => {
  const internData = await InternService.getInterns();
  await setInterns(internData);

  const teamData = await TeamService.getTeams();
  await setTeams(teamData);

  setIsLoading(false);
};


// Check if we can fetch all the data from database:
useEffect(() => {
  if(!isLoading){
    console.log("Interns: ", interns);
    console.log("Teams: ", teams);
  }

}, [isLoading]);


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
            
            <DataContext.Provider value={{interns, teams, isLoading}}>
              <Routes>
                <Route path="/" element={ <HomePage />} />
                <Route path="/interns" element={ <InternsPage />} />
                <Route path="/add-intern" element={ <AddInternPage isEdit={false}/>} />
                <Route path="/add-team" element={ <AddTeamPage />} />
                <Route path="/documents/" element={ <PDFViewer pdfUrl='/documents/' />} />

                <Route path="*" element={<NotFound />}></Route>
              </Routes>
            </DataContext.Provider>
          </Content>


          <Footer style={{ textAlign: 'center' }}>{footer}</Footer>
        </Layout>
      </Layout>
      
  );

  
};

export default App;