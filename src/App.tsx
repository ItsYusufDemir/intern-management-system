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
import Login from "./components/Login";
import AddUserPage from './components/AddUserPage';
import { BrowserRouter as Router, Route, useMatch, Routes, useNavigate, useLocation } from "react-router-dom";
import PDFViewer from './components/PDFViewer';
import {Team} from "./models/Team";
import {Intern} from "./models/Intern";
import { Layout, Menu, theme, type MenuProps } from 'antd';
import InternService from './services/InternService';
import TeamService from './services/TeamService';
import RequireAuth from './utils/RequireAuth';
import LayoutComponent from './components/LayoutComponent';


const DataContext = createContext<{interns: Intern[]; teams: Team[], isLoading: boolean;}>({interns: [], teams: [], isLoading: true});
export const useDataContext = () => {
  const context = useContext(DataContext);

  return context;
}


const App: React.FC = () => {

  const [interns, setInterns] = React.useState<Intern[]>([]);
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getData();
  }, []);

  // GET ALL DATA FROM DATABASE
  const getData = async () => {
    const internData = await InternService.getInterns();
    setInterns(internData);

    const teamData = await TeamService.getTeams();
    setTeams(teamData);

    setIsLoading(false);
  };

  // Check if we can fetch all the data from the database:
  React.useEffect(() => {
    if (!isLoading) {
      console.log("Interns: ", interns);
      console.log("Teams: ", teams);
    }
  }, [isLoading]);

  return (
    
    <DataContext.Provider value={{interns, teams, isLoading}}>
        <Routes>
          {/* Public route for login */}
          <Route path="/login" element={<Login />}></Route>
          
          
          {/* Protected routes*/}
          <Route path='/' element={<LayoutComponent />}>
              <Route element={<RequireAuth />}>
                <Route path='/' element={ <HomePage />} />
                <Route path="interns" element={ <InternsPage />} />
                <Route path="add-intern" element={ <AddInternPage isEdit={false}/>} />
                <Route path="add-team" element={ <AddTeamPage />} />
                <Route path="add-user" element={<AddUserPage />} />

                <Route path='*' element={<NotFound />} />
              </Route>
          </Route>
          

        </Routes>
        </DataContext.Provider>
      
    
      
  );

  
};

export default App;