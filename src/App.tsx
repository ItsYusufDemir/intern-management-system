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
import NotFound from './components/Notfound';
import Login from "./components/Login";
import AddPage from './components/AddPage';
import { BrowserRouter as Router, Route, useMatch, Routes, useNavigate, useLocation } from "react-router-dom";
import {Team} from "./models/Team";
import {Intern} from "./models/Intern";
import TeamService from './services/TeamService';
import RequireAuth from './utils/RequireAuth';
import LayoutComponent from './components/LayoutComponent';
import useAuth from './utils/useAuth';
import Unauthorized from './components/Unauthorized';
import PersistLogin from './components/PersistLogin';
import Applications from './components/ApplicationsPage';
import ApplyPage from './components/ApplyPage';
import ChangePassword from './components/ChangePassword';
import MyProfile from './components/MyProfile';


const App: React.FC = () => {

  const ROLES = {
    "Admin": 5150,
    "Supervisor": 1984,
    "Intern": 2001,
  }

  return (
    
    
        <Routes>
          {/* Public route for login */}
          <Route path="/login" element={<Login />}></Route>

          <Route path="/apply" element={<ApplyPage />} />
          
          
          {/* Protected routes*/}
          
          <Route path='/' element={<PersistLogin />}>
              <Route element={<LayoutComponent />}>
                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path='/' element={ <HomePage />} />
                </Route>

                <Route element={<RequireAuth  allowedRoles={[ROLES.Admin, ROLES.Supervisor]} />}>
                  <Route path="interns" element={ <InternsPage />} />
                </Route>

                <Route element={<RequireAuth  allowedRoles={[ROLES.Admin,ROLES.Supervisor]} />}>
                  <Route path="add-intern" element={ <AddInternPage/>} />
                </Route> 

                <Route element={<RequireAuth  allowedRoles={[ROLES.Admin]} />}>
                  <Route path="add" element={<AddPage />} />
                </Route>

                <Route element={<RequireAuth  allowedRoles={[ROLES.Admin]} />}>
                  <Route path="intern-applications" element={<Applications />} />
                </Route>

                <Route element={<RequireAuth  allowedRoles={[ROLES.Admin, ROLES.Supervisor, ROLES.Intern]} />}>
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>

                <Route element={<RequireAuth  allowedRoles={[ROLES.Admin, ROLES.Supervisor, ROLES.Intern]} />}>
                  <Route path="profile" element={<MyProfile />} />
                </Route>


              </Route>
          </Route>
          
            
          {/*All other routes*/}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path='*' element={<NotFound />} />
              
          
          

        </Routes>
  );

  
};

export default App;