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
import {Team} from "./models/Team";
import {Intern} from "./models/Intern";
import InternService from './services/InternService';
import TeamService from './services/TeamService';
import RequireAuth from './utils/RequireAuth';
import LayoutComponent from './components/LayoutComponent';
import useAuth from './utils/useAuth';


const App: React.FC = () => {

  return (
    
    
        <Routes>
          {/* Public route for login */}
          <Route path="/login" element={<Login />}></Route>
          
          
          {/* Protected routes*/}
          <Route path='/' element={<LayoutComponent />}>
              <Route element={<RequireAuth allowedRoles={["Admin", "Supervisor"]} />}>
                <Route path='/' element={ <HomePage />} />
              </Route>

              <Route element={<RequireAuth  allowedRoles={["Admin", "Supervisor"]} />}>
                <Route path="interns" element={ <InternsPage />} />
              </Route>

              <Route element={<RequireAuth  allowedRoles={["Admin"]} />}>
                <Route path="add-intern" element={ <AddInternPage isEdit={false}/>} />
              </Route> 

              <Route element={<RequireAuth  allowedRoles={["Admin"]}/>}>
                <Route path="add-team" element={ <AddTeamPage />} />
              </Route>

              <Route element={<RequireAuth  allowedRoles={["Admin"]} />}>
                <Route path="add-user" element={<AddUserPage />} />
              </Route>
          </Route>
            
          {/*All other routes*/}
          <Route path='*' element={<NotFound />} />
              
          
          

        </Routes>
  );

  
};

export default App;