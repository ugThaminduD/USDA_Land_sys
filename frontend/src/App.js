import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline } from '@mui/material'; // Add this for consistent baseline styles


import Login from "./components/Users_Login/User_login";
import AdminPanel from "./components/AdminPanel/AdminPanel";

import PlanningWelcomePage from './components/Planning & Monitoring Division/WelcomePage';
import LandList from "../src/components/Planning & Monitoring Division/LandList";
import LandDetails from "../src/components/Planning & Monitoring Division/LandDetails";
import LandInput from "../src/components/Planning & Monitoring Division/LandInput";
import LandDetailsInput from "../src/components/Planning & Monitoring Division/LandInput copy";
import SocialDevelopmentInput from "../src/components/Planning & Monitoring Division/SocialDetailsInput";

import ExcelFile_Upload from "../src/components/Planning & Monitoring Division/ExcelFile_Upload";
import ExcelDataView from "../src/components/Planning & Monitoring Division/ExcelDataView";
import ExcelFilesList from "../src/components/Planning & Monitoring Division/ExcelFilesList";


   
function App() {
  return (
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />


          <Route path="/" element={<PlanningWelcomePage />} />
          <Route path="/input" element={<LandInput onSuccess={() => window.location.reload()} />} />
          <Route path="/land/input" element={<LandDetailsInput onSuccess={() => window.location.reload()} />} />
          <Route path="/edit/land/:id" element={<LandInput />} />
          <Route path="/LandList" element={<LandList />} />
          <Route path="/land/:id" element={<LandDetails />} />

          <Route path="/input2" element={<SocialDevelopmentInput onSuccess={() => window.location.reload()} />} />

          

          <Route path="/upload/excelDocument" element={<ExcelFile_Upload />} />
          <Route path="/excel/data/view" element={<ExcelDataView />} />
          <Route path="/excel/files" element={<ExcelFilesList />} />
          <Route path="/excel/file/:id" element={<ExcelDataView />} />
          
        </Routes>
      </Router>
  );
}

export default App;
